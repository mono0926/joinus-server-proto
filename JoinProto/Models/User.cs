using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace JoinProto.Models
{
    public class User
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        [JsonIgnore]
        public virtual ICollection<Location> Locations { get; set; }
    }
}
