using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using JoinProto.Models;

namespace JoinProto.Controllers
{
    [RoutePrefix("api/locations")]
    public class LocationsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Locations
        public IQueryable<Location> GetLocations()
        {
            return db.Locations.Include(x => x.User);
        }

        // GET: api/Locations
        public IQueryable<Location> GetLocations(int userId)
        {
            return db.Locations.Where(x => x.UserId == userId);
        }

        [Route("adjust")]
        public IHttpActionResult GetAdjustTime(int diff)
        {
            foreach (var l in db.Locations.ToList())
            {
                l.Time = l.Time.Value.AddHours(diff);
            }
            db.SaveChanges();
            return Ok("ok");
        }

        // GET: api/Locations/5
        [ResponseType(typeof(Location))]
        public async Task<IHttpActionResult> GetLocation(int id)
        {
            Location location = await db.Locations.FindAsync(id);
            if (location == null)
            {
                return NotFound();
            }

            return Ok(location);
        }

        // PUT: api/Locations/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutLocation(int id, Location location)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != location.Id)
            {
                return BadRequest();
            }

            db.Entry(location).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LocationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Locations
        [ResponseType(typeof(Location))]
        public async Task<IHttpActionResult> PostLocation(Location location)
        {
            if (!ModelState.IsValid && location.Type != null)
            {
                return BadRequest(ModelState);
            }

            location.User = await db.AppUsers.FirstOrDefaultAsync(x => x.Id == location.UserId);
            if (!location.Time.HasValue)
            {
                var tokyoTZ = TimeZoneInfo.FindSystemTimeZoneById("Tokyo Standard Time");
                location.Time = DateTime.Now + (tokyoTZ.BaseUtcOffset - TimeZoneInfo.Local.BaseUtcOffset);
            }
            if (location.Type == null)
            {
                location.Type = Location.DefaultType;
            }

            db.Locations.Add(location);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = location.Id }, location);
        }

        // DELETE: api/Locations/5
        [ResponseType(typeof(Location))]
        public async Task<IHttpActionResult> DeleteLocation(int id)
        {
            Location location = await db.Locations.FindAsync(id);
            if (location == null)
            {
                return NotFound();
            }

            db.Locations.Remove(location);
            await db.SaveChangesAsync();

            return Ok(location);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LocationExists(int id)
        {
            return db.Locations.Count(e => e.Id == id) > 0;
        }
    }
}