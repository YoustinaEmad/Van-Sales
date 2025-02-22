export enum PageEnum {
  //#region Pages live Operation
  Live_Operation = 100,
  Live_Operation_Dashboard = 101,
  Live_Operation_Marketing = 102,
  Live_Operation_Dashboard_Abused = 103,
  //#endregion Pages live Operation
  //#region Pages Trips
  Trips = 200,
  Trips_History = 202,
  Trips_Ignored_Expired_Requests = 204,
  Trips_Validation_Requests = 205,
  Trips_Uncompleted_Cancelled = 206,
  Trips_By_Deliveryman_Service = 210,
  //#endregion Pages Trips
  //#region Pages Tasks
  Tasks = 300,
  Tasks_Recent = 301,
  Tasks_History = 302,
  Tasks_Uncompleted_Cancelled = 303,
  Tasks_Scheduled = 304,
  Tasks_Transfers = 305,
  Tasks_Abuse = 311,
  Tasks_Abuse_Requests = 312,
  Tasks_source = 313,
  Task_Online_Ordering = 314,
  Tasks_Can_Not_Deliver = 315,
  Tasks_All = 316,
  // [Name: "By Provider"]
  Tasks_Orders_By_Provider = 317,
  // [Name: "By Store"]
  Tasks_Orders_By_Store = 318,
  // [Name: "By Team"]
  Tasks_Orders_By_Team = 319,
  // [Name: "By Brand"]
  Tasks_Orders_By_Brand = 320,
  // [Name: "By Rider"]
  Tasks_Orders_By_Rider = 321,
  // [Name: "By Dates"]
  Tasks_Orders_By_Dates = 322,

  //#endregion Pages Tasks
  //#region Pages agents
  Agent_Delivery = 400,
  Agent_profiles = 401,
  Agent_Requests = 402,
  Agent_Shifts = 403,
  Agent_Shifts_Working_Hours = 404,
  Agent_Shifts_Availability = 405,
  Agent_Shifts_Penalized = 406,
  Agent_Shifts_Break = 407,
  Agent_Schedule = 408,
  Agent_Skills = 409,
  Agent_Vehicles = 410,
  Agent_Trip_Request = 412,
  Agent_Dedicated = 411,
  Agent_Provider = 413,
  Agent_Archive_Reasons = 414,
  Agent_Archive = 415,
  Agent_Allowed_Version = 416,
  Agent_Deprecated_Versions = 417,
  Agent_Accounting = 418,
  Agent_Upload = 419,
  // [Name: "Vehicle Type"]
  Agent_Vehicle_Type = 420,
  Agent_Dedicated_Store = 421,
  //#endregion Pages agents
  //#region Pages Stores
  Sites = 500,
  Sites_Hub = 501,
  Sites_Area = 502,
  Sites_Monitoring_Tracking = 503,
  Sites_Delivery_Time = 507,
  Sites_City = 509,
  Sites_Country = 510,
  Sites_DeliveryZone = 511,
  Sites_Store = 512,


  //#endregion Pages Stores
  //#region Pages Customers
  Customers = 600,
  Customers_Home = 601,
  Customers_Shipping_addresses = 602,
  Customers_Reviews = 603,
  Customers_Call_Center = 604,
  Customer_Upload = 605,
  //#endregion Pages Customers
  //#region Pages Accounts
  Accounts = 700,
  Accounts_Wallet = 701,
  Accounts_Collection_Module = 702,
  Accounts_Delivery_Bundles = 703,
  Accounting_Wallet_Store = 704,
  Accounting_Wallet_Agent = 705,
  Accounting_Wallet_Transaction = 706,
  Accounting_Wallet_Validation = 707,
  Accounting_Agent_Orders_Wallet = 708,
  //#endregion Pages Accounts
  //#region Pages Billing & Invoices
  Billing_Invoices = 800,
  Billing_Invoices_Billing = 801,
  Billing_Invoices_Invoices = 802,
  //#endregion Pages Billing & Invoices
  //#region Pages Ranking
  Ranking_Board = 900,
  Ranking_Board_Delivery_Agents = 901,
  Ranking_Board_Stores = 902,
  Ranking_Board_Preparing_Agents = 903,
  //#endregion Pages Ranking
  //#region Pages Analytics
  Analytics = 1000,
  Analytics_Trip = 1001,
  Analytics_Trips_By_Date = 207, //1002
  Analytics_Trips_By_Stores = 208,//1003
  Analytics_Trips_By_Deliveryman = 209,//1003
  Analytics_Taks = 1004,
  Analytics_Tasks_By_Date = 306, //1005
  Analytics_Tasks_By_Team = 307,//1006
  Analytics_Tasks_By_Deliveryman = 308, //10077
  Analytics_Tasks_By_Preparation_Time = 1008,

  Analytics_Tasks_By_Preparation_Time_store = 309,//1009
  Analytics_Tasks_By_Preparation_Time_user = 310,//1010
  Analytics_Performance = 1011,
  Analytics_Performance_Area = 508,//1012
  Analytics_Performance_Team = 505,//1013
  Analytics_Performance_Behavior = 506,//1014
  Analytics_Performance_Store = 1015,//1015

  // Region: Items
  Items = 1201,
  // [Name: "Items"]
  Items_Home = 1226,
  // [Name: "Vehicles Quantity Specifications"]
  Vehicles_Quantity = 1227,


  //#endregion Pages Analytics
  //#region Pages Configuration
  Configuration = 1200,
  Configuration_Skills = 1202,
  Configuration_Create = 1203,
  Configuration_Order = 1204,
  Configuration_Trip = 1205,
  Configuration_Revenue = 1206,
  Configuration_Address = 1207,

  Configuration_Company = 1209,
  Configuration_Store = 1210,
  Configuration_Team = 1211,


  Configuration_Company_Preferences = 1212,
  Configuration_Company_Operation = 1213,
  Configuration_Company_Auto_Dispatch = 1214,
  Configuration_Company_Agent = 1215,
  Configuration_Company_Performance_SLA = 1216,
  Configuration_Company_Districts_Segmentation = 1217,


  Configuration_Team_Home = 1219,
  Configuration_Team_Auto_Dispatch = 1220,
  Configuration_Team_Route_Optmization = 1221,
  // Configuration_Team_Auto_Dispatch = 1222,

  Smart_Routes = 1218,
  Smart_Routes_Home = 1223,
  Smart_Routes_Zone = 1208,
  Smart_Routes_Geofence_Zone = 1224,
  Smart_Routes_Geofence_Route = 1225,
  Smart_Routes_Upload =2024 ,

  //#endregion Pages configuration
  //#region Pages Dispatch
  Dispatch = 1300,
  Dispatch_Dashboard = 1301,
  //#endregion Pages Dispatch
  //#region Pages Live Tracking
  Live_Tracking = 1400,
  //#endregion Pages Live Tracking
  //#region Pages System
  System = 1500,
  System_Page = 1501,
  System_Page_Home = 1507,
  System_Page_Role = 1502,
  System_Page_Company = 1506,
  System_Feature = 1503,
  System_Feature_Module = 1508,
  System_Feature_Role = 1504,
  System_Feature_Company = 1505,
  //#endregion Pages System
  //#region Pages Broadcast
  Broadcast = 1600,
  Broadcast_Home = 1601,

  //#endregion Pages Broadcast
  //#region Pages Heatmap
  Heatmap = 1700,
  Heatmap_Home = 1701,
  //#endregion Pages Heatmap
  //#region Pages users
  Users = 1800,
  Users_Home = 1801,
  Users_Roles_Permissions = 1802,
  Users_Log = 1803,
  Developer_Home = 1804,
  //#endregion Pages users


  //#REGION SHIFTS
  Shifts = 1900,
  Shifts_Planned_Schedule = 1902,
  Shifts_Planned_Details = 1903,
  // [Name: "Rider Shift Report"]
  Shifts_Attendance = 1905,

  //#REGION agent custody
  Agent_Custody = 2000,
  Agent_Custody_home = 2001,
  Agent_Custody_transactions = 2002,
  // [Name: "Stores"]
  Custody_Stores = 2003,

  //#REGION marketing
  Marketing = 2100,
  Store_Managers = 3000,


  //#REGION brand
  Brand = 2200,

  //#REGION Bundle
  Bundle = 2300,
  Bundle_Home = 2301,

  //#REGION Planned Dispatch
  Planned_Trips = 2400,
  Planned_Trips_Home = 2401,

  //#REGION Planner
  Planner = 2500,
  Planner_Home = 2501,
}
