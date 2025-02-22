export enum FeatureEnum {
  // Module Trips,
  Trip_Get_Archived = 1010,
  Trip_EditRate = 1024,
  Trip_Manage_Requests = 1048,
  Trip_SetAsPickedUp = 1049,
  Trip_Last_Trip = 1055,
  Trip_HistoryReportByStore = 1058,
  Trip_MaxTripCapacity = 1059,
  Trip_History_Report = 1070,
  Trip_Uncompleted_Cancelled_Report = 1071,
  Trip_Request_Report = 1072,
  Trip_AnalyticsReportByDate = 1075,
  // [Name: "Trip_History_Report_ByAgent"]
  Trip_History_Report_ByAgent = 1078,
  Trip_Manage_Uncompleted_Cancelled = 1079,
  Trip_Manage_Validation_Requset = 1080,

  // Module Dashboard
  // Manage Dashboard Paged
  Live_Operation_Manage_Dashboard = 1012,
  Live_Operation_Manage_Dashboard_Abused = 1018,
  Dashboard_Show_Cycle_Time = 1015,
  //Module  Marketing
  Marketing_Manage_Index = 1014,
  // Module Anayltics,
  Anayltics_Manage_Task_Rider = 1051,
  Anayltics_Manage_Perfomance_Behavior = 1053,
  Anayltics_Manage_Perfomance_Area = 1054,
  Anayltics_Manage_Perfomance_Store = 1060,
  Anayltics_Perfomance_Store_Show_Preparing_Duration = 1061,

  Task_AnalyticsReportByDate = 2135,
  Task_AnalyticsReportByTeam = 2136,
  Task_AnalyticsReportPreparationTime = 2137,

  // Trips features= Features related to Trips,
  Trips_Validation_Requests_Report = 1073,
  Trips_By_Deliveryman_Service_Report = 1074,
  Trips_AnalyticsReportByStore = 1076,
  Trips_AnalyticsReportByAgent = 1077,


  Task_Manage_Uncompleted = 2012,//303
  Task_Heatmap_Manage = 6024,
  Task_GetArchivedOrders = 2029,//303
  // [Name: "Download Abuse By Agent Report"]
  Task_GetReportAbuseByAgent = 2114,
  // [Name: "Store Order Performance Report"]
  Task_History_Report_ByStore = 2116,
  Task_Print_Details = 2117,//302
  Task_GetReportHistory = 2130,//302
  Task_GetReportUncompleted = 2131,//303
  Task_GetReportTransfers = 2132,//305
  Task_GetReportAbuse = 2133,//311
  // [Name: "Task_Report_ByRider_PerStore"]
  Task_Report_ByRider_PerStore = 2138,//302
  // [Name: "Task_Report_ByRider"]
  Task_AnalyticsReportByAgent = 2139,//307
  Task_Analytics_ByAgent_Manage = 2140,//308
  Task_History_Report_ByRemoved_FromTrip = 2143,//302
  Task_Requset_Abused_Aprroved = 2144,//312
  Task_Requset_Abused_Reject = 2145,//312
  // [Name: "Remove Task Abuse"]
  Task_Remove_Abused = 2146,//311
  Task_History_Report_BySchedule = 2147,
  Task_Display_Verified_Location = 2149,//302
  Task_History_Report_Can_Not_Deliver = 2150,//315
  Task_Request_Remove_Abuse = 2152,//302
  Task_Verified_Zone = 2154,//302
  Task_Allow_Display_Brand = 2155,//302
  Task_ManualVerify_Location = 2158,
  Task_Estimated_Delivery_Time = 2159,
  // [Name: "Get Task KPI Report"]
  Task_GetReportKPI = 2160,
  // [Name:" Dispatches Order Count in Task index"]
  Task_Dispatches_Order_Count = 2162,
  Task_ShowTransite = 2054,//302
  Task_Details_Remove_Abuse = 2055,//302
  Task_GetAlternativeOrders = 2067,
  // [Name:" Task Serving Time in order card"]
  Task_Serving_Time = 2163,
  // [Name:" Task Report By Brand"]
  Task_Report_ByBrand = 2164,
  // [Name:"Task Report by Rider"]
  Task_Report_ByRider = 2165,//302
  // [Name:"Task Reference Number In History"]
  Task_Reference_Number_in_History = 2176,
  Task_Manage_Cant_Deliver = 3061,//315

  // [Name:"Manage Tasks Main Page"]
  Task_Manage_Main_Page = 2166,
  // [Name:"Manage Orders By Store"]
  Task_Manage_Orders_By_Store = 2168,
  // [Name:"Report Task History By Provider"]
  Task_History_Report_ByProvider = 2169,
  // [Name:"Manage Orders By Team"]
  Task_Manage_Orders_By_Team = 2170,
  // [Name:"Manage Orders By Brand"]
  Task_Manage_Orders_By_Brand = 2171,
  // [Name:"Report Task History By Team"]
  Task_History_Report_ByTeam = 2172,

  // [Name:"Manage Orders By Dates"]
  Task_Manage_Orders_By_Dates = 2177,
  // [Name:"Report Task History By Dates"]
  Task_History_Report_ByDates = 2175,
  // [Name:"Report Task History By Rider"]
  Task_History_Report_ByRider = 2178,

  // [Name:"Scheduled Task Index"]
  Task_Scheduled_Task_Index = 2179,


  // [Name: "Task Verify Location"]
  Task_Verify_Location = 2156,//302

  // [Name: "Task UnVerify Location"]
  Task_UnVerify_Location = 2157,//302
  // [Name: "Dispatch Lock Task"]
  Task_Lock_Task = 6014,

  // [Name: "Tasks Index By Provider"]
  Task_Index_By_Provider = 2181,
  // [Name: "Tasks Index By Rider"]
  Task_Index_By_Rider = 2182,
  // [Name: "Get Call Center Agent Orders"]
  Task_Get_Call_Center_Agent_Orders = 2184,//314
  // [Name: "Get Abused Task Index"]
  Task_Get_Abused_Task_Index = 2185,
  // in dispatch
  // Task_SetTaskAsPaied = 2186,
  // in custody transaction page
  Task_SettlePaiedTask = 2187,
  Task_CanManageAbuseRequests = 2188,//312

  //module Accounting
  Accounting_Transactions_Charge_Amounts_Report = 2189,
  Accounting_Agent_Charge_Amounts_By_Rider_Report = 2190,
  Accounting_Store_Charge_Amounts_By_TeamName_Report = 2191,


// Module Agent
  Agent_AddToQueueAsync = 3000,//401
  // [Name: "Agent_EndShift"]

  Agent_EndShift = 3001,
  // [Name: "Agent_Archive"]

  Agent_Archive = 3002,//401
  // [Name: "Agent_UnArchive"]

  Agent_UnArchive = 3003,//401
  // [Name: "Agent_LogOutFromAllDevices"]

  Agent_LogOutFromAllDevices = 3005,//401
  // [Name: "Rider_MainInfo"]
  Agent_GetProfiles = 3007,
  Agent_DeliverymanTeamUpdate = 3011,
  Agent_DeliverymanBreakClose = 3013,
  // [Name: "Agent_Manage_CustodyOff_Custody"]
  Agent_Manage_CustodyOff_Custody = 3014,
  // [Name: "Agent_DeliverymanPenalizeRemove"]

  Agent_DeliverymanPenalizeRemove = 3015,
  Agent_DeliverymanPenalizeGetReport = 3016,//406
  Agent_Manage_CustodyOff_Transaction = 3020,//2002
  Agent_Manage_RankBoard_Rider = 3022,
  Agent_DeliverymanShiftGetReport = 3028,//404
  Agent_GetMonthlyWalletTransactionReport = 3030,//705

  Agent_WalletTransactionPost = 3032,
  Agent_WalletTransactionDelete = 3033,
  Agent_Post = 3037,
  Agent_GetStatusList = 3039,
  // [Name: "Agent_Lock_Unlock"]

  Agent_Lock_Unlock = 3040,
  Agent_GetStoresWalletReport = 3050,

  Agent_Provider_Manage = 3051,
  Agent_Archive_Reason_Manage = 3052,
  Agent_Archive_Rider_Manage = 3053,
  Agent_CustodyOff_Report = 3054,
  Agent_Shift_Working_hours_Manage = 3055,//404
  Agent_Shift_Penalized_Manage = 3056,
  // [Name: "Rider_ExportReport"]
  Agent_Home_Download_Report = 3058,
  Agent_CanManageBundleHome = 3063,
  Agent_BundleOfRider = 3065,
  // [Name: "Rider_ChangePassword"]
  Agent_Change_Password = 3066,
  Team_QRCode = 3076,
  Team_Bundle_In_Create = 3077,
  // [Name:"Report Riders Shifts"]
  Agent_Report_Riders_shifts = 3078,//404
  Agent_Report_Riders_breaks = 3079,
  Agent_WalletTransactionReport = 3080,
  Agent_BroadCastIndexShowRecieved = 3081,
  Agent_BroadCastDetailsShowRecieved = 3082,
  Agent_OnDemandCreate = 3083,
  Agent_OnDemandInRidersHome = 3084,
  // [Name:"Manage CustodyOff Stores"]
  Agent_Manage_CustodyOff_Stores = 3085,
  // [Name: Upload Riders]
  Agent_Upload_Riders = 3086,
  // [Name: Upload Skills]
  Agent_Upload_Skills = 3087,
  // [Name: Upload Teams]
  Agent_Upload_Teams = 3088,
  // [Name:"Manage Vehicle Type"]
  Agent_Manage_Vehicle_Type = 3089,
  Agent_CanManageAccountingRevenu = 3094,
  Agent_Edit = 3101,//401
  Agent_Custody_Bulk_Cancel = 3102,//2001



  // [Name: "Rider_GetAlternativeRiders"]
  Agent_Rider_GetAlternativeRiders = 3091,

  // [Name: "Rider_LastLocations"]
  Agent_Rider_LastLocations = 3059,
  // [Name: "Rider_TeamProfileRiders"]
  Agent_Rider_TeamProfileRiders = 3092,
  // [Name: "Rider_CustodyLiveDispatch"]
  // Agent_Rider_CustodyLiveDispatch = 3093,











  Agent_Dedicated_Store = 3100,
  // BroadCast features= Features related to BroadCast,
  BroadCast_Manage_Home = 3009,
  // Module Accounting,
  Accounting_Store_Manage = 3018,//704
  Accounting_Mange_Agent = 3019,//705
  Accounting_Transaction_Manage = 3057,
  // Module Shift,
  Shift_Manage_Planned_Schedule = 3026,//1902
  Shift_Manage_Planned_Details = 3027,//1903
  Shift_Riders_Day_Off = 3035,
  // [Name:"Manage Download Shift Report"]
  Shift_Manage_Attendance = 3041,//1905
  Shift_Manage_Actual_Break = 4004,
  // [Name: "Shift_Manage_Actual_Availability_Request"]

  Shift_Manage_Actual_Availability_Requset = 4005,
  Shift_Assign = 4006,
  // Store features= Features related to Sites,
  Sites_Manage = 4000,
  Sites_Hub_Manage = 4001,

  // Module Tracking
  Sites_Hub_Manage_MonitoringTracking = 4002,

  Sites_Hub_Manage_Hubs = 4003,
  Sites_Hub_GetPerformanceReport = 4007,
  Sites_Hub_Delete = 4009,
  Sites_Hub_Copy = 4016,
  Sites_Hub_Configuration = 4018,
  Sites_Hub_DeliveryTimeReport = 4021,
  Sites_Hub_Manage_Dedicated = 4022,
  Sites_Hub_Version = 4023,
  Sites_City_Manage = 4024,
  Sites_Country_Manage = 4025,
  Sites_DelviryZone_Manage = 4026,
  Sites_Store_Version = 4027,
  Sites_Store_Manage = 4028,
  // [Name:"Monitoring & Tracking Report"]
  Sites_Monitoring_Tracking_Report = 4029,
  // User features= Features related to User,
  // [Name: Upload Stores]
  Sites_Upload_Stores = 4030,
  // [Name: Upload Delivery Zones]
  Sites_Upload_Delivery_Zones = 4031,

  User_ChangeActivationStatus = 5000,
  User_Add = 5012,
  User_Manage = 5014,
  User_Manage_Roles = 5015,
  User_UpdateRole = 5029,
  User_UpdateSore = 5030,
  User_ForceLogout = 5031,
  User_SwitchAllowMultipleDevices = 5032,
  User_IsAllow_Create_With_Username = 5033,
  User_Manage_Log = 5034,
  User_Log = 5035,
  User_Log_History = 5036,
  User_DeactivateToken = 5037,
  User_Unlock = 5038,
  User_CanMangeToken = 5039,

  // Dispatch Module
  Trip_CloseTrip = 1002,
  Trip_CancelTrip = 1003,
  Trip_AssignToDM = 1004,
  Trip_CreateSpecialTrip = 1005,
  // Task features= Features related to Task,
  Task_RemoveFromTrip = 2000,//1300
  Task_AddToTrip = 2001,//1300
  // [Name: "Cancel Order"]
  Task_CancelOrder = 2002,//1300
  Task_PauseOrder = 2003,//1300
  Task_UnPauseOrder = 2004,//1300
  // [Name:"Set As Ready"]
  Task_SetAsReady = 2005,//1300
  Task_DeliverOrder = 2006,//1300
  Task_ChangePriority = 2007,//1300
  Task_UpdateOrderInfo = 2008,//1300
  Task_SetAsInProgress = 2010,//1300
  Task_Inprogress_Status = 2013,//1300
  Task_CreateFastFastOrder = 2042,//1300
  Task_CreateFastOrder = 2059,//1300

  // [Name:"print task"]
  Task_removeSyncedDate = 2053,//1300
  Dispatch_End_Shift = 2082,//1300
  Dispatch_GetKpis = 2083,
  Dispatch_Start_Shift = 2084,//1300
  Task_ChangeStore = 2153,//1300
  Task_ChangeTrip = 2102,
  Task_ScheduleOrder = 2103,
  Task_NewStatus = 2112,
  // [Name:Dispatch Task Transfers tab]
  Task_TransferStatus = 2113,
  Task_CancelOTP = 2115,
  // [Name: "Start_Break"]
  Dispatch_Start_Break = 6005,
  // [Name: "End_Break"]

  Dispatch_End_Break = 6006,
  Dispatch_End_Penalize = 6007,
  Dispatch_Item_AddToFastTask = 6008,
  Dispatch_Show_Riders = 6009,
  Dispatch_Unscheduale_Task = 6010,
  // [Name: "Dispatch Reset Vehicle Type"]

  Dispatch_Reset_Vehicle_Type = 6011,
  Dispatch_Paused_Staus_Tab = 6012,
  // [Name: "Dispatch Add Notes"]
  Dispatch_Add_Notes = 6013,
  Dispatch_Lock_Task = 6014,
  Dispatch_Unlock_Task = 6015,
  Dispatch_Manage_Dashboard = 6016,
  Dispatch_Show_All_Stores = 6017,
  // [Name: "Can_Extend_Shift"]

  Dispatch_Can_Extend_Shift = 6018,
  Dispatch_Can_Show_Team_Name_Pickup_Card = 6019,
  // [Name: "Dispatch_Force_Change_Team"]

  Dispatch_Force_Change_Team = 6020,
  // [Name: "Dispatch_Nearest_Riders"]

  Dispatch_Nearest_Riders = 6021,
  Dispatch_Alternative_Riders = 6022,
  // [Name: "Dispatch Delivery Restriction"]

  Dispatch_Delivery_Restriction = 6023,
  // [Name: "Dispatch Bulk Cancel Task"]
  Dispatch_Bulk_Cancel_Task = 6025,
  Dispatch_Refund_Task = 6027,
  // [Name:"Planned Trip In Side Menu"]
  Dispatch_Can_Manage_Planned_Trip_Side_Menu = 6028,
  // [Name:"Manage Planned Trip Home"]
  Dispatch_Can_Manage_Planned_Trip_Home = 6029,
  // [Name:"Dispatchs Count In Task Card"]
  Dispatch_Dispatches_Order_Count = 6030,
  // [Name:"Task Reference Number In Dispatch"]
  Dispatch_Reference_Number_Of_Task = 6031,
  Dispatch_Enable_Out_Zone_Order = 6032,
  // [Name:"Online Ordering whatsapp Message"]
  Dispatch_Online_Ordering_whatsapp_Popup = 6033,
  // [Name:"Planner In Side Menu"]
  // Dispatch_Can_Manage_Planner_Side_Menu = 6034,
  // [Name:"Manage Planner Home"]
  Dispatch_Can_Manage_Planner_Home = 6035,
  // [Name:"update Rider Custody in Dispatch"]

  Agent_Dispatcher_Deliverymen = 3036,
  Dispatch_Update_Rider_Custody = 6037,
  // [Name:"Dispatch Mark Task As Paid"]
  Dispatch_Mark_Task_As_Paid = 6038,
  // [Name:'Can Access Dispatch By Area']
  Dispatch_Can_Access_Dispatch_ByArea = 6039,
  Dispatch_Add_Rider_Message_Order = 6040, //1300,
  Dispatch_Pause_Order_Reason = 6041, //1300,
  Dispatch_Task_CreateTransferOrder = 6042, //1300,

  // Brand features= Features related to Brand,
  Brand_Manage = 7000,
  Brand_Manage_Home = 7001,

  // Item features= Features related to Item,
  Item_Manage = 8000,
  Item_SetAsServiceItem = 8001,
  Item_Put = 8003,
  Item_UpdatePriority = 8008,
  Item_AddToFastTask = 8009,
  // [Name: "Manage Item Home"]
  Item_Home_Manage = 8010,
  // [Name: "Manage Vehicles Quantity"]
  Vehicles_Quantity_Manage = 8011,


  // Routes features= Features related to Routes,
  Routes_Manage = 9000,
  Routes_Manage_Home = 9001,
  Routes_Manage_Delivery_Zone = 9002,
  Routes_Manage_Delivery_Zone_GeoFece = 9003,
  Routes_Manage_Route_GeoFece = 9004,
  Routes_Import_Data=9005,
  Routes_Upload_Delivery_Zones = 9006,
  // Module Customer,
  Customer_Manage_Home = 10002,
  Customer_Manage_ShippingAddress = 10003,
  Customer_Manage_Review = 10004,
  Customer_ShippingAddress_report = 10006,
  Customer_Review_report = 10007,
  Customer_Home_report = 10008,
  Customer_UpdatePriority = 10030,
  Customer_IsTransite = 10031,
  // UPLOAD features= Features related to UPLOAD,
  UPLOAD_CUSTOMERS_TEMPLATE = 10032,
  // DOWNLOAD features= Features related to DOWNLOAD,
  DOWNLOAD_CUSTOMERS_TEMPLATE = 10033,
  Customer_Update_Info = 10034,
  Customer_Manage_Upload = 10035,

  // Confuguration
  Config_Rider_Pickedup_Button = 11000,
  Config_Task_Actions_In_Rider_App = 11001,
  Config_Manage_Abuse_Configuration = 11002,
  Config_Advanced_Task_Revenue = 11003,
  Config_Manage_Company_Managae_Company = 11004,
  Config_Manage_Company_Manage_Team = 11005,
  Config_Manage_Company_Manage_STORE = 11006,
  Config_Manage_Home_Managae_Home = 11007,
  Config_Company_Default_Bundle = 11008,
  Config_Team_Default_Bundle = 11009,
  // LiveTracking
  Live_Tracking_Manage=12000//1400
}
