using System;
using System.Web;
using System.Configuration;
using System.IO;
using System.Data.SQLite;

/// <summary>
/// DataBase
/// </summary>
namespace Igprog {
    public class DataBase {
        string dataBase = ConfigurationManager.AppSettings["UserDataBase"];

        public DataBase() {
        }

        //tables
        public string orders = "orders";

        #region CreateTable
        public void Orders(string path) {
            string sql = @"CREATE TABLE IF NOT EXISTS orders
                (firstName NVARCHAR(50),
                lastName NVARCHAR(50),
                companyName NVARCHAR(50),
                address NVARCHAR(50),
                postalCode NVARCHAR(50),
                city NVARCHAR(50),
                country NVARCHAR(50),
                pin VARCHAR(50),
                email VARCHAR(50),
                ipAddress VARCHAR(50),
                application VARCHAR(50),
                version VARCHAR(50),
                licence VARCHAR(50),
                licenceNumber VARCHAR(50),
                price VARCHAR(50),
                priceEur VARCHAR(50),
                orderDate VARCHAR(50),
                additionalService NVARCHAR(200),
                note NVARCHAR(200))";
            CreateTable(path, sql);
        }
        
        #endregion

        public void CreateDataBase(string table) {
            try {
                string path = GetDataBasePath(dataBase);
                string dir = Path.GetDirectoryName(path);
                if (!Directory.Exists(dir)) {
                    Directory.CreateDirectory(dir);
                }
                if (!File.Exists(path)) {
                    SQLiteConnection.CreateFile(path);
                }
                CreateTables(table, path);
            } catch (Exception e) { }
        }

      
        private void CreateTables(string table, string path) {
            switch (table) {
                case "orders":
                    Orders(path);
                    break;
                default:
                    break;
            }
        }

        private void CreateTable(string path, string sql) {
            try {
                if (File.Exists(path)){
                    SQLiteConnection connection = new SQLiteConnection("Data Source=" + path);
                    connection.Open();
                    SQLiteCommand command = new SQLiteCommand(sql, connection);
                    command.ExecuteNonQuery();
                    connection.Close();
                };
            } catch (Exception e) { }
        }

        public string GetDataBasePath(string dataBase) {
            return HttpContext.Current.Server.MapPath(string.Format("~/App_Data/{0}", dataBase));
        }

    }

}
