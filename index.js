$("#submitButt").click(function () {
  $(this).toggleClass("active");
});
$(function () {
  $("#test").focus();
  sessionStorage.setItem("sessionId", Math.floor(Math.random() * 37));
});
document.querySelector(".floating-btn").addEventListener("click", function (e) {
  e.target.closest("button").classList.toggle("clicked");
});

function myFunction() {
  var x = document.getElementById("myDIV");
  console.log(x);
  console.log(x.classList.contains("open"));
  if (x.classList.contains("open")) {
    x.classList.remove("open");
  } else {
    x.classList.add("open");
    $("#chatroom_box").animate({ scrollTop: $("#chatroom_box").height() });
  }
}

function send_text() {
  if ($("#text_typed").val() !== "") {
    let query = $("#text_typed").val();
    $("#chatroom_box").append(`
            <li class="user_text">${query}</li>
        `);
    $("#text_typed").val("");

    let data = {
      queryText: query,
      sessionId: sessionStorage.getItem("sessionId"),
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/test",
      data: JSON.stringify(data), // now data come in this function
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      dataType: "json",
      success: function (data, status, jqXHR) {
        $("#chatroom_box").append(`
                    <li class="bot_text">${data.text}</li>
                `);
        if (
          data.queryResult.action == "PLAN_INTENT.PLAN_INTENT-custom" &&
          !data.queryResult.intent.isFallback
        ) {
          checkIfItineraryPossible(
            data.queryResult.parameters.fields.budgets.structValue.fields.amount
              .numberValue
          );
        }
      },

      error: function (jqXHR, status) {
        // error handler
        console.log(jqXHR);
        alert("fail" + status.code);
      },
    });
  }
}

document.getElementById("text_typed").addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    document.getElementById("send_button").click();
  }
});

function checkIfItineraryPossible(amount) {
  console.log("amount :", amount);
  if (amount < 1000) {
    $("#chatroom_box").append(`
                    <li class="bot_text">Sorry! Creating this itinerary must have a budget more than 1000 USD.</li>
                `);
  } else {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/getItinerary",
      data: JSON.stringify({ amount: 1500 }),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      dataType: "json",
      success: function (resp, status, jqXHR) {
        if (resp.itinerary.length > 0) {
          $("#chatroom_box").append(`
          <li class="bot_text">
            ${createItineraryView(resp.itinerary)}
          </li>
          `);
        }
      },

      error: function (jqXHR, status) {
        // error handler
        console.log(jqXHR);
        alert("fail" + status.code);
      },
    });
  }
}

function createItineraryView(arr) {
  let finalHTML = '';
  arr.forEach(element => {
    finalHTML += `
      <div class="days_card">
          <h2 style="margin: 0 0 5px; border-bottom: 1px solid #bbbbbb;">DAY: ${element.day}</h2>
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px">${element.plan.heading}</div>
          <div style="margin-bottom: 10px">${element.plan.details}</div>
          ${element.hotels ? createHotelsHtml(element.hotels) : ''}
      </div>
    `;
  });
  console.log('finalHTML: ', finalHTML)
  return finalHTML;
}

function createHotelsHtml(arr) {
  let hotelsHtml = `
    <div style="font-size: 14px; font-weight: bold">Hotels To Stay</div>
  `;
    arr.forEach(element => {
      hotelsHtml += `
        <div class="hotel_available">
            <div class="hotel_name"><img src="./assets/hotel.png" style="height: 20px; margin-right: 10px;">${element.name}</div>
            <a target=”_blank” href="${element.url}" class="hotel_url" >Check the hotel</a>
        </div>    
      `;
    });
    return hotelsHtml
  
}