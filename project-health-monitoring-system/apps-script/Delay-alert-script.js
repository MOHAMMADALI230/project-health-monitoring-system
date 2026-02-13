function checkDelayedProjects() { 

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return; // No data

  var data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
  var email = "your_email@gmail.com";

  // Ensure Risk_Log sheet exists
  var riskSheet = ss.getSheetByName("Risk_Log");
  if (!riskSheet) {
    riskSheet = ss.insertSheet("Risk_Log");
    riskSheet.appendRow(["Date", "Project Name", "Issue Type"]);
  }

  for (var i = 0; i < data.length; i++) {

    var projectName = data[i][0];
    var status = data[i][9];
    var notified = data[i][10];

    if (status === "Delayed" && notified !== "Sent") {

      MailApp.sendEmail({
        to: email,
        subject: "🚨 Project Delay Alert: " + projectName,
        body:
          "Project Name: " + projectName +
          "\nStatus: Delayed" +
          "\nPlease review timeline and dependencies immediately." +
          "\n\nThis is an automated alert from Project Monitoring System."
      });

      riskSheet.appendRow([new Date(), projectName, "Delayed"]);

      sheet.getRange(i + 2, 11).setValue("Sent");
    }
  }
}
