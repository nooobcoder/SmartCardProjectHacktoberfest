using Newtonsoft.Json;

namespace REST.Entities.DatabaseEntities
{
    public class EUser
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Pin { get; set; }
        public string Role { get; set; }

        // Get all fields as JSON
        public string GetJson()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
