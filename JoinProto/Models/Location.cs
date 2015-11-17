using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace JoinProto.Models
{
    public class Distance
    {
        public Location From { get; set; }
        public Location To { get; set; }
        public double Interval => From.Distance(To) * 1000;
        public string IntervalString => $"{Interval:f2} m";
    }

    public class Location
    {
        public const string DefaultType = "significant_change";
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime? Time { get; set; }
        public int UserId { get; set; }
        [Required, MinLength(1)]
        public string Type { get; set; }
        public virtual User User { get; set; }

        public double Distance(Location other, char unit = 'K')
        {
            var lat1 = Latitude;
            var lon1 = Longitude;
            var lat2 = other.Latitude;
            var lon2 = other.Longitude;
            double theta = lon1 - lon2;
            double dist = Math.Sin(deg2rad(lat1)) * Math.Sin(deg2rad(lat2)) + Math.Cos(deg2rad(lat1)) * Math.Cos(deg2rad(lat2)) * Math.Cos(deg2rad(theta));
            dist = Math.Acos(dist);
            dist = rad2deg(dist);
            dist = dist * 60 * 1.1515;
            if (unit == 'K')
            {
                dist = dist * 1.609344;
            }
            else if (unit == 'N')
            {
                dist = dist * 0.8684;
            }
            return (dist);
        }

        //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        //::  This function converts decimal degrees to radians             :::
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        private double deg2rad(double deg)
        {
            return (deg * Math.PI / 180.0);
        }

        //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        //::  This function converts radians to decimal degrees             :::
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        private double rad2deg(double rad)
        {
            return (rad / Math.PI * 180.0);
        }
    }
}
