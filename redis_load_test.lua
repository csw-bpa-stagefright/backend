for i = 1, 10000 do
  redis.call("SET", "key:" .. i, string.rep("A", 200))
end

for i = 1, 10000 do
  redis.call("DEL", "key:" .. i)
end
