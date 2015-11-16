using JoinProto.Models;
using log4net.Core;

namespace JoinProto.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLocationType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Locations", "Type", c => c.String(nullable: false, defaultValue:Location.DefaultType));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Locations", "Type");
        }
    }
}
