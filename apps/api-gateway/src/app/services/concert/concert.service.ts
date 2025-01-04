import { AuthService, Err, Ok, PrismaService, Result, ResultInterface } from "@backend/libs";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Concert } from "@prisma/client";
import { Cache } from "cache-manager";
import getConcerts from "../../concerts";

@Injectable()
export class ConcertService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy
  ) { }

  async reset() {
    try {
      const concerts = getConcerts();
      await this.prisma.concert.deleteMany();
      for (const concert of concerts) {
        await this.prisma.concert.create({
          data: {
            location: concert.location,
            ticketCost: concert.ticketPricing,
            name: concert.name,
            description: concert.description,
            date: concert.date,
            imageUrl: concert.imageLink
          }
        });
      }
    } catch (e) {

    }
  }

  async getOneConcert(payload: {
    id: string
  }): Promise<Result<{ concert?: Concert } & ResultInterface<string>, ResultInterface<string>>> {
    try {
      const cachedConcert = await this.cacheManager.get<Concert>(`concert-${payload.id}`);

      if (cachedConcert) {
        return new Ok({ data: "success", concert: cachedConcert });
      }

      const concert = await this.prisma.concert.findFirst({
        where: {
          id: payload.id
        }
      });
      if (!concert) {
        return new Err({ data: 'error', error: "no concert found" });
      }

      this.cacheManager.set("concert", concert);

      return new Ok({ data: "success", concert: concert });

    } catch (e) {
      Logger.error(e);
      return new Err({ data: 'error', error: e })
    }
  }

  async getConcerts(payload: {
    skip: number;
    take: number;
  }): Promise<Result<{ concerts?: Concert[] } & ResultInterface<string>, ResultInterface<string>>> {
    try {
      if ((payload.skip == 0) && (payload.take == 20)) {
        const cachedConcerts = await this.cacheManager.get<Concert[]>("concerts");
        if (!(cachedConcerts)) {
          const concerts = await this.prisma.concert.findMany({
            skip: payload.skip,
            take: payload.take,
            orderBy: {
              date: 'desc'
            }
          });

          this.cacheManager.set("concerts", concerts);

          return new Ok({ data: "success", concerts: concerts });
        } else {
          return new Ok({ data: "success", concerts: cachedConcerts });
        }
      }

      const concerts = await this.prisma.concert.findMany({
        skip: payload.skip,
        take: payload.take,
        orderBy: {
          date: 'desc'
        }
      });

      return new Ok({ data: "success", concerts: concerts });

    } catch (e) {
      Logger.error(e);
      return new Err({ data: 'error', error: e })
    }
  }

  async createConcert(payload: {
    token: string;
    name: string;
    description: string;
    ticketCost: number;
    location: string;
    date: Date;
  }): Promise<Result<{ concert?: Concert } & ResultInterface<string>, ResultInterface<string>>> {
    try {
      const verify = this.authService.verifyJwt(payload.token);

      if (verify.statusCode == 1) {
        return new Err({ data: 'error', error: 'JWT verification error' });
      }

      if (verify.isValid == false) {
        return new Err({ data: 'error', error: 'Invalid JWT' });
      }

      if (!(verify.payload)) {
        return new Err({ data: 'error', error: "Unreadable JWT payload" });
      }

      if (!(verify.payload.userId)) {
        return new Err({ data: 'error', error: "User ID not in JWT payload" });
      }

      if (!(verify.payload.isAdmin) || (verify.payload.isAdmin == false)) {
        return new Err({ data: 'error', error: "Unauthorized" });
      }

      const newConcert = await this.prisma.concert.create({
        data: {
          name: payload.name,
          description: payload.description,
          ticketCost: payload.ticketCost,
          date: payload.date,
          location: payload.location
        }
      });

      await this.cacheManager.del("concerts");

      try {
        await this.clientProxy.emit("NEW_CONCERT_ALERT", {
          concert: newConcert
        });
      } catch (e) {
        Logger.error(`Notification send failed: ${e}`)
      }

      return new Ok({ data: 'success', concert: newConcert });
    } catch (e) {
      Logger.error(e);
      return new Err({ data: 'error', error: e })
    }
  }
}
