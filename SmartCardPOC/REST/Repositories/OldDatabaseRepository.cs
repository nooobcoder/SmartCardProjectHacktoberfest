using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using REST.Entities;

namespace REST.Repositories
{
    public class OldDatabaseRepository
    {
        private NpgsqlConnection connection;
        private string CONNECTION_STRING = "Host=100.101.46.6;" +
                                           "Username=ankurpaul;" +
                                           "Password=adminadmin;" +
                                           "Database=test" +
                                           "Pooling=True";

        public OldDatabaseRepository()
        {
            // Log
            Console.WriteLine("Database Repository Connection Pool Open");
            connection = new NpgsqlConnection(CONNECTION_STRING);
            connection.Open();
        }

        private const string TABLE_NAME = "Games";
        public async Task Add(BoardGame game)
        {

            string commandText = $"INSERT INTO {TABLE_NAME} (id, Name, MinPlayers, MaxPlayers, AverageDuration) VALUES (@id, @name, @minPl, @maxPl, @avgDur)";
            Console.WriteLine(commandText);
            await using (var cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("id", game.Id);
                cmd.Parameters.AddWithValue("name", game.Name);
                cmd.Parameters.AddWithValue("minPl", game.MinPlayers);
                cmd.Parameters.AddWithValue("maxPl", game.MaxPlayers);
                cmd.Parameters.AddWithValue("avgDur", game.AverageDuration);

                await cmd.ExecuteNonQueryAsync();
            }
        }

        private static BoardGame ReadBoardGame(NpgsqlDataReader reader)
        {
            int? id = reader["id"] as int?;
            string name = reader["name"] as string;
            short? minPlayers = reader["minplayers"] as Int16?;
            short? maxPlayers = reader["maxplayers"] as Int16?;
            short? averageDuration = reader["averageduration"] as Int16?;

            BoardGame game = new BoardGame
            {
                Id = id.Value,
                Name = name,
                MinPlayers = minPlayers.Value,
                MaxPlayers = maxPlayers.Value,
                AverageDuration = averageDuration.Value
            };
            return game;
        }


        // READ
        public async Task<BoardGame> GetRowById(int id)
        {
            string commandText = $"SELECT * FROM {TABLE_NAME} WHERE ID = @id";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("id", id);

                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                    while (await reader.ReadAsync())
                    {
                        BoardGame game = ReadBoardGame(reader);
                        return game;
                    }
            }
            return null;
        }

        // READ LAST ROW
        public async Task<BoardGame> GetLastRow()
        {
            string commandText = $"SELECT * FROM {TABLE_NAME} ORDER BY ID DESC LIMIT 1";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                    while (await reader.ReadAsync())
                    {
                        BoardGame game = ReadBoardGame(reader);
                        return game;
                    }
            }
            return null;
        }

        // Get all rows
        public async Task<BoardGame[]> GetAllRows()
        {
            string commandText = $"SELECT * FROM {TABLE_NAME}";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var games = new List<BoardGame>();
                    while (await reader.ReadAsync())
                    {
                        BoardGame game = ReadBoardGame(reader);
                        games.Add(game);
                    }
                    return games.ToArray();
                }
            }
        }

        public async Task Update(int id, BoardGame game)
        {
            var commandText = $@"UPDATE {TABLE_NAME}
                SET Name = @name, MinPlayers = @minPl, MaxPlayers = @maxPl, AverageDuration = @avgDur
                WHERE id = @id";

            await using (var cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("id", game.Id);
                cmd.Parameters.AddWithValue("name", game.Name);
                cmd.Parameters.AddWithValue("minPl", game.MinPlayers);
                cmd.Parameters.AddWithValue("maxPl", game.MaxPlayers);
                cmd.Parameters.AddWithValue("avgDur", game.AverageDuration);

                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task Delete(int id)
        {
            string commandText = $"DELETE FROM {TABLE_NAME} WHERE ID=(@p)";
            await using (var cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("p", id);
                await cmd.ExecuteNonQueryAsync();
            }
        }
        public async Task CreateTableIfNotExists()
        {
            var sql = $"CREATE TABLE if not exists {TABLE_NAME}" +
                $"(" +
                $"id serial PRIMARY KEY, " +
                $"Name VARCHAR (200) NOT NULL, " +
                $"MinPlayers SMALLINT NOT NULL, " +
                $"MaxPlayers SMALLINT, " +
                $"AverageDuration SMALLINT" +
                $")";

            using var cmd = new NpgsqlCommand(sql, connection);

            await cmd.ExecuteNonQueryAsync();
        }

        // Close the connection
        public void Close()
        {
            connection.Close();
            Console.WriteLine("Database Repository Connection Pool Closed");
        }
    }
}
