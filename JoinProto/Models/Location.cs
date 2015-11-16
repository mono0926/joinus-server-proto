﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace JoinProto.Models
{
    public class Location
    {
        public const string DefaultType = "significant_change";
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime? Time { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; }
    }
}
