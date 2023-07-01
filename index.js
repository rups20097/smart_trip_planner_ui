let booking_details = {}
let itinerary_request_details = {};

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
    // $("#chatroom_box").animate({ scrollTop: $("#chatroom_box").height() });
  }
}

function send_text(defaultQry="") {
  console.log('CALLING SEND TEXT',$("#text_typed").val(), $("#text_typed").val() !== "");

  if ($("#text_typed").val() !== "" || defaultQry !== "") {
    // $("#chatroom_box").animate({ scrollTop: $("#chatroom_box").height() });
    let query = defaultQry ? defaultQry : $("#text_typed").val();
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
        // if (
        //   data.queryResult.action == "PLAN_INTENT.PLAN_INTENT-custom" && !data.queryResult.intent.isFallback
        // ) {
        //   checkIfItineraryPossible(
        //     data.queryResult.parameters.fields.budgets.structValue.fields.amount
        //       .numberValue
        //   );
        // }
        if (data.queryResult.intent.displayName == "PLAN_INTENT" && data.queryResult.parameters.fields["geo-state-us"].stringValue !== "") {
          itinerary_request_details["place"] = data.queryResult.parameters.fields["geo-state-us"].stringValue;
        }
        if (data.queryResult.intent.displayName == "PLAN_INTENT - GIVEN_BUDGET") {
          itinerary_request_details["budget"] = `${data.queryResult.parameters.fields.budgets.structValue.fields.amount.numberValue} USD`;
          askChatGptForItinerary(itinerary_request_details)
        }
        if (data.queryResult.intent.displayName == "BOOK_A_HOTEL") {
          booking_details["hotel_name"] = data.queryResult.parameters.fields.hotelName.stringValue;
        }
        if (data.queryResult.intent.displayName == "BOOK_A_HOTEL - Members") {
          booking_details["guests"] = data.queryResult.parameters.fields.number.numberValue;
        }
        if (data.queryResult.intent.displayName == "BOOK_A_HOTEL - Members - Rooms") {
          booking_details["rooms"] = data.queryResult.parameters.fields.number.numberValue;
        }
        if (data.queryResult.intent.displayName == "BOOK_A_HOTEL - Members - Rooms - Dates") {
          booking_details["checkindate"] = data.outputContexts[0].parameters.fields["date-time.original"].stringValue.split(' to ')[0];
          booking_details["checkoutdate"] = data.outputContexts[0].parameters.fields["date-time.original"].stringValue.split(' to ')[1];

          let link = `https://www.wyndhamhotels.com/hotels/west-dennis-dennis-ma-usa?brand_id=TL&checkInDate=${booking_details["checkindate"]}&checkOutDate=${booking_details["checkoutdate"]}&useWRPoints=false&children=0&adults=${booking_details["guests"]}&rooms=${booking_details["rooms"]}&referringBrand=TL&loc=ChIJt8CwZ105-4kR8F0uh8-HEQc&sessionId=123123123`;

          console.log(booking_details, link);
          let html = `
          <div>
          <strong>Hotel : </strong>${booking_details["hotel_name"]}
          </div>
          <div>
          <strong>No of guests : </strong>${booking_details["guests"]}
          </div>
          <div>
          <strong>No of rooms : </strong>${booking_details["rooms"]}
          </div>
          <div>
          <strong>Check-in date : </strong>${booking_details["checkindate"]}
          </div>
          <div>
          <strong>Check-out date : </strong>${booking_details["checkoutdate"]}
          </div>
          <div style="margin: 10px 0">
            <a style="margin: 0; text-decoration: none" class="booking_btn" target=”_blank” href="${link}" class="hotel_url" >Complete the booking</a>
          </div>
          `;

          $("#chatroom_box").append(`
                    <li class="bot_text">${html}</li>
                `);
        }
        console.log('itinerary_request_details', itinerary_request_details)
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

// function checkIfItineraryPossible(amount) {
//   console.log("amount :", amount);
//   if (amount < 1000) {
//     $("#chatroom_box").append(`
//                     <li class="bot_text">Sorry! Creating this itinerary must have a budget more than 1000 USD.</li>
//                 `);
//   } else {
//     $.ajax({
//       type: "POST",
//       url: "http://localhost:3000/getItinerary",
//       data: JSON.stringify({ amount: 1500 }),
//       contentType: "application/json; charset=utf-8",
//       crossDomain: true,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//       },
//       dataType: "json",
//       success: function (resp, status, jqXHR) {
//         if (resp.itinerary.length > 0) {
//           $("#chatroom_box").append(`
//           <li class="bot_text">
//             ${createItineraryView(resp.itinerary)}
//           </li>
//           `);
//         }
//       },

//       error: function (jqXHR, status) {
//         // error handler
//         console.log(jqXHR);
//         alert("fail" + status.code);
//       },
//     });
//   }
// }

// function createItineraryView(arr) {
//   let finalHTML = '';
//   arr.forEach(element => {
//     finalHTML += `
//       <div class="days_card">
//           <h2 style="margin: 0 0 5px; border-bottom: 1px solid #bbbbbb;">DAY: ${element.day}</h2>
//           <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px">${element.plan.heading}</div>
//           <div style="margin-bottom: 10px">${element.plan.details}</div>
//           ${element.hotels ? createHotelsHtml(element.hotels) : ''}
//       </div>
//     `;
//   });
//   console.log('finalHTML: ', finalHTML)
//   return finalHTML;
// }

function createHotelsHtml(arr) {
  let hotelsHtml = `
    <div style="font-size: 14px; font-weight: bold">Hotels To Stay</div>
  `;
    arr.forEach(element => {
      hotelsHtml += `
        <div class="hotel_available">
            <div class="hotel_name"><img src="./assets/hotel.png" style="height: 20px; margin-right: 10px;">${element.name}</div>
            <a class="booking_btn" style="text-decoration: none" target=”_blank” href="${element.url}" class="hotel_url" >Check the hotel</a>
            <button class="booking_btn" onclick="send_text('create a booking for cape cod by wyndham')">Book Now</button>
        </div>    
      `;
    });
    return hotelsHtml
  
}

// let firstTime = true;
// let container = $("#chatroom_box");
// function scroll_bottom() {
//   if (firstTime) {
//     container.scrollTop = container.scrollHeight;
//     firstTime = false;
//   } else if (container.scrollTop + container.clientHeight === container.scrollHeight) {
//     container.scrollTop = container.scrollHeight;
//   }
// }

function askChatGptForItinerary(obj) {
  let prompt = `Create an itinerary for ${obj.place} within the budget of ${obj.budget}`
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/askChatGpt",
    data: JSON.stringify({ prompt }),
    contentType: "application/json; charset=utf-8",
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
    dataType: "json",
    success: function (resp, status, jqXHR) {
      if (resp.response) {
        $("#chatroom_box").append(`
          <li class="bot_text">
            ${generateHTMLFromResp(resp.response)}
          </li>
        `)
      } else {
        alert(resp.error)
      }
    },

    error: function (jqXHR, status) {
      // error handler
      console.log(jqXHR);
      alert("fail" + status.code);
    },
  });
}

function generateHTMLFromResp(chatGptReply) {
  console.log('generateHTMLFromResp >>>>>>>>>')
  let len = chatGptReply.split('\n\n').length;
  if (len < 2) {
    console.log('generateHTMLFromResp IF>>>>>>>>>')
    return chatGptReply;
  } else {
    console.log('generateHTMLFromResp ELSE>>>>>>>>>')
    let finalHTML = '';
    
    for (let i = 0; i < len - 1; i++) {
      console.log('LOOP --', i);
      let heading = chatGptReply.split('\n\n')[i].split('\n')[0];
      let headingArr = heading.split(': ');
      let desc = chatGptReply.split('\n\n')[i].split(heading).join('').replace(/\n/, '');
      finalHTML += `
        <div class="days_card">
            <h2 style="margin: 0 0 5px; border-bottom: 1px solid #bbbbbb;">${headingArr[0]}</h2>
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px">${headingArr[1]}</div>
            <div style="margin-bottom: 10px">${desc}</div>
            ${checkHotels(headingArr[1])}
        </div>
      `;
    }
    console.log('finalHTML ------', finalHTML);
    return finalHTML;
  }
}

function checkHotels(place) {
  if (place && place.toLowerCase().includes("boston")) {
    let hotelsHtml = `
      <div style="font-size: 14px; font-weight: bold">Hotels To Stay</div>
      <div class="hotel_available">
          <div class="hotel_name"><img src="./assets/hotel.png" style="height: 20px; margin-right: 10px;">Wyndham Boston Beacon Hill</div>
          <a class="booking_btn" style="text-decoration: none" target=”_blank” href="https://www.wyndhambeaconhill.com" class="hotel_url" >Check the hotel</a>
          <button class="booking_btn">Book Now</button>
      </div>    
    `;
    return hotelsHtml;
  } else if (place && place.toLowerCase().includes("cape cod")) {
    let hotelsHtml = `
      <div style="font-size: 14px; font-weight: bold">Hotels To Stay</div>
      <div class="hotel_available">
          <div class="hotel_name"><img src="./assets/hotel.png" style="height: 20px; margin-right: 10px;">Travelodge by Wyndham Cape Cod Area</div>
          <a class="booking_btn" style="text-decoration: none" target=”_blank” href="https://www.wyndhamhotels.com/travelodge/west-dennis-massachusetts/travelodge-cape-cod-area/overview" class="hotel_url" >Check the hotel</a>
          <button class="booking_btn" onclick="send_text('create a booking for cape cod by wyndham')">Book Now</button>
      </div>    
    `;
    return hotelsHtml;
  } else if (place && place.toLowerCase().includes("lexington")) {
    let hotelsHtml = `
      <div style="font-size: 14px; font-weight: bold">Hotels To Stay</div>
      <div class="hotel_available">
          <div class="hotel_name"><img src="./assets/hotel.png" style="height: 20px; margin-right: 10px;">Origin Lexington, a Wyndham Hotel</div>
          <a class="booking_btn" style="text-decoration: none" target=”_blank” href="https://www.wyndhamhotels.com/wyndham/lexington-kentucky/origin-lexington/overview" class="hotel_url" >Check the hotel</a>
          <button class="booking_btn">Book Now</button>
      </div>    
    `;
    return hotelsHtml;
  } else {
    return ''
  }
}