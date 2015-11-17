using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using JoinProto.Models;

namespace JoinProto.Controllers
{
    public class MapController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Map
        public async Task<ActionResult> Index(string date)
        {
            ViewBag.Date = date ?? DateTime.Now.ToString("yyyy/MM/dd");
            DateTime targetDate;
            
            var locations = await db.Locations.Include(l => l.User).ToListAsync();
            if (DateTime.TryParse((ViewBag.Date as String), out targetDate))
            {
                locations = locations.Where(x => x.Time.Value.Date == targetDate.Date).ToList();
            }
            locations = locations.OrderBy(x => x.UserId).ThenBy(x => x.Time).ToList();
            return View(locations);
        }

        // GET: Map/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Location location = await db.Locations.FindAsync(id);
            if (location == null)
            {
                return HttpNotFound();
            }
            return View(location);
        }

        // GET: Map/Create
        public ActionResult Create()
        {
            ViewBag.UserId = new SelectList(db.AppUsers, "Id", "DisplayName");
            return View();
        }

        // POST: Map/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Latitude,Longitude,Time,UserId")] Location location)
        {
            if (ModelState.IsValid)
            {
                db.Locations.Add(location);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.UserId = new SelectList(db.AppUsers, "Id", "DisplayName", location.UserId);
            return View(location);
        }

        // GET: Map/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Location location = await db.Locations.FindAsync(id);
            if (location == null)
            {
                return HttpNotFound();
            }
            ViewBag.UserId = new SelectList(db.AppUsers, "Id", "DisplayName", location.UserId);
            return View(location);
        }

        // POST: Map/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Latitude,Longitude,Time,UserId")] Location location)
        {
            if (ModelState.IsValid)
            {
                db.Entry(location).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.UserId = new SelectList(db.AppUsers, "Id", "DisplayName", location.UserId);
            return View(location);
        }

        // GET: Map/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Location location = await db.Locations.FindAsync(id);
            if (location == null)
            {
                return HttpNotFound();
            }
            return View(location);
        }

        // POST: Map/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Location location = await db.Locations.FindAsync(id);
            db.Locations.Remove(location);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
