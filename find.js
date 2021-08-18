function change() {
  var itemidSelected = document.getElementsByName("info_mj");
  var itemID = itemidSelected.options[itemidSelected.selectedIndex].value;
  console.log(itemID);
}

function pop_up() {
  var target = document.querySelector("#set_point1");
  var target2 = document.querySelector("#shadow1");
  target.style.display = "flex";
  target2.style.display = "flex";
  $("#x1").click(function () {
    target.style.display = "none";
    target2.style.display = "none";
  });
  $("#shadow1").click(function () {
    target.style.display = "none";
    target2.style.display = "none";
  });
}

function submit() {
  var info_name = document.getElementById("info_name").value;
  var info_age = document.getElementById("info_age").value;
  var info_sex = document.getElementById("info_sex").value;
  var info_id = document.getElementById("info_id").value;
  var info_mj = document.getElementById("info_mjmj").value;
  var info_sem = document.getElementById("info_sem").value;
  var info_score1 = document.getElementById("info_score1").value;
  var info_score2 = document.getElementById("info_score2").value;
  var info_region = document.getElementById("info_region").value;
  var info_money = document.getElementById("info_money").value;
  info_score1 *= 1;
  info_score2 *= 1;
  if (
    info_name == "" ||
    info_age == "" ||
    info_mj == "" ||
    info_score1 == "" ||
    info_score2 == ""
  ) {
    alert("모든 항목을 입력해주세요.");
    return;
  } else if (info_id.length != 10) {
    alert("학번은 숫자 10자리를 입력해주세요.");
    return;
  } else if (
    info_score1 < 0 ||
    info_score1 > 4.5 ||
    info_score2 < 0 ||
    info_score2 > 4.5
  ) {
    alert("학점은 0과 4.5 사이여야 합니다.");
    return;
  }

  const request = new XMLHttpRequest();
  request.onreadystatechange = function (evnet) {
    if (request.readyState == 4 && request.status == 200) {
      // response 받기
      var rsp = request.responseText;
      data = JSON.parse(rsp);

      // 그림 지우기
      var pic = document.getElementById("before_search");
      pic.style.display = "none";

      // 추천 장학금 개수 세기
      var cnt_sch = 0;
      for (var i = 0; i < Object.keys(data).length; i++) {
        cnt_sch += Object.keys(data[i].cluster_contents).length;
      }

      // 개인 맞춤 comment
      $("#rr1").text(`[ '${info_name}' 님을 위한 총 `);
      $(".counter").text(cnt_sch);
      $("#rr3").text(" 개의 장학금이 발견되었어요! ]");
      // get_counter();

      $("div").remove(".m");
      var cnt1 = 0;
      for (var i = 0; i < Object.keys(data).length; i++) {
        if (Object.keys(data[i].cluster_contents).length != 0) {
          cnt1++;
          var cluster_name = data[i].cluster_name;
          var data_cluster_name;
          if (cluster_name == "ai_recommendation")
            data_cluster_name = "AI 추천 장학금";
          else if (cluster_name == "feature") data_cluster_name = "특별 장학금";
          else if (cluster_name == "activity_0")
            data_cluster_name = "활동성 장학금";
          else if (cluster_name == "activity_1")
            data_cluster_name = "수혜성 장학금";
          else if (cluster_name == "characteristic_0")
            data_cluster_name = "소득연계 장학금";
          else if (cluster_name == "characteristic_1")
            data_cluster_name = "성적연계 장학금";
          else if (cluster_name == "characteristic_2")
            data_cluster_name = "소득, 성적연계 장학금";
          else if (cluster_name == "characteristic_money_0")
            data_cluster_name = "등록금 삭감 장학금";
          else if (cluster_name == "characteristic_money_1")
            data_cluster_name = "생활비 지급 장학금";
          else if (cluster_name == "characteristic_money_2")
            data_cluster_name = "등록금, 생활비 지급 장학금";
          else if (cluster_name == "region") data_cluster_name = "지역 장학금";

          var newDIV1 = document.createElement("div");
          newDIV1.setAttribute("class", "m");
          newDIV1.setAttribute("onclick", "cluster(" + i + ")");
          newDIV1.innerHTML = `${cnt1}. ${data_cluster_name}`;
          var mc = document.getElementById("menu_content");
          mc.appendChild(newDIV1);
        }
      }

      cluster(0);

      $(function () {
        var cnt0 = 0;

        counterFn();

        function counterFn() {
          id0 = setInterval(count0Fn, 25);

          function count0Fn() {
            cnt0++;
            if (cnt0 > cnt_sch) {
              clearInterval(id0);
            } else {
              $(".counter").text(cnt0);
            }
          }
        }
      });
    }
  };

  request.open(
    "GET",
    `http://118.67.129.218:5000//main_request?name=${info_name}&age=${info_age}&sex=${info_sex}&id_students=${info_id}&major=${info_mj}&last_score=${info_score1}&avg_score=${info_score2}&place=${info_region}&income=${info_money}&semester=${info_sem}`,
    true
  );
  request.send();
}

function scholarship(a, b) {
  var esch = data[a].cluster_contents[b];
  var target = document.querySelector("#set_point2");
  var target2 = document.querySelector("#shadow2");
  target.style.display = "flex";
  $("#set_point2").scrollTop(0);
  target2.style.display = "flex";
  $("#x2").click(function () {
    target.style.display = "none";
    target2.style.display = "none";
  });
  $("#shadow2").click(function () {
    target.style.display = "none";
    target2.style.display = "none";
  });

  $("#h_title").text(esch.name);

  var date_start = esch.date_start.split(" ")[0].replaceAll("-", ".");
  var date_end = esch.date_end.split(" ")[0].replaceAll("-", ".");
  var price = esch.scholarship_price
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  var in_school = esch.in_school;
  var crt = esch.characteristic;
  var rcd = esch.recommendation;
  var other = esch.other;
  var link = esch.link;
  var feature = esch.feature;
  var feature_other = esch.feature_specified;

  if (crt == "해당없음") crt = "소득 및 성적과 관계없는";
  if (rcd == "필요합니다") rcd = "필요합니다.";
  $("#d_info").text(`${date_start} ~ ${date_end}`);
  if (price == "0") {
    $("#d_info_price").text(`- 원 (장학금 상세 참고)`);
  } else {
    $("#d_info_price").text(`${price} 원`);
  }

  $("#d_info_d").text(
    `해당 장학금은 ${in_school} 장학금으로 ${crt} 장학금입니다. 해당 장학금을 지원하기 위해서는 추천서가 ${rcd}`
  );

  var wu = document.getElementById("w_u");
  wu.remove();

  var dt = document.getElementById("dt");

  var wu = document.createElement("div");
  wu.setAttribute("class", "w-u");
  wu.setAttribute("id", "w_u");
  dt.appendChild(wu);

  var w1 = document.createElement("div");
  w1.setAttribute("id", "w1");
  var w2 = document.createElement("div");
  w2.setAttribute("id", "w2");
  var w3 = document.createElement("div");
  w3.setAttribute("id", "w3");

  var w11 = document.createElement("span");
  w11.setAttribute("id", "w11");
  var w21 = document.createElement("span");
  w21.setAttribute("id", "w21");
  var w31 = document.createElement("span");
  w31.setAttribute("id", "w31");

  w11.innerHTML = "기타 사항";
  w21.innerHTML = "신청 링크";
  w31.innerHTML = "관련 장학금 태그";

  var w12 = document.createElement("span");
  w12.setAttribute("id", "w12");
  var w22 = document.createElement("span");
  w22.setAttribute("id", "w22");
  var w32 = document.createElement("span");
  w32.setAttribute("id", "w32");
  var wlink = document.createElement("a");
  wlink.setAttribute("id", "a_link");

  w11.style.color = "cornflowerblue";
  w21.style.color = "cornflowerblue";
  w31.style.color = "cornflowerblue";

  if (other != "nan") {
    w12.innerHTML = `: ${other}`;
    wu.appendChild(w1);
    w1.appendChild(w11);
    w1.appendChild(w12);
  }

  if (link != "nan") {
    w22.innerHTML = `: ${link}`;
    wlink.setAttribute("href", `http://${link}`);
    wlink.setAttribute("target", "_blank");
    wu.appendChild(w2);
    w2.appendChild(w21);
    w2.appendChild(wlink);
    wlink.appendChild(w22);
  } else if (link == "nan") {
    w22.innerHTML = `: 고려대학교 포털`;
    wlink.setAttribute("href", `https://portal.korea.ac.kr/front/Intro.kpd`);
    wlink.setAttribute("target", "_blank");
    wu.appendChild(w2);
    w2.appendChild(w21);
    w2.appendChild(wlink);
    wlink.appendChild(w22);
  }

  if (feature != "nan" && feature_other == "nan") {
    w32.innerHTML = `: #${feature}`;
    wu.appendChild(w3);
    w3.appendChild(w31);
    w3.appendChild(w32);
  } else if (feature == "nan" && feature_other != "nan") {
    w32.innerHTML = `: #${feature_other}`;
    wu.appendChild(w3);
    w3.appendChild(w31);
    w3.appendChild(w32);
  } else if (feature != "nan" && feature_other != "nan") {
    w32.innerHTML = `: #${feature}, #${feature_other}`;
    wu.appendChild(w3);
    w3.appendChild(w31);
    w3.appendChild(w32);
  }
}

function cluster(cnt) {
  var dt = data[cnt];
  var cluster_name = dt.cluster_name;
  if (cluster_name == "ai_recommendation") data_cluster_name = "AI 추천 장학금";
  else if (cluster_name == "feature") data_cluster_name = "특별 장학금";
  else if (cluster_name == "activity_0") data_cluster_name = "활동성 장학금";
  else if (cluster_name == "activity_1") data_cluster_name = "수혜성 장학금";
  else if (cluster_name == "characteristic_0")
    data_cluster_name = "소득연계 장학금";
  else if (cluster_name == "characteristic_1")
    data_cluster_name = "성적연계 장학금";
  else if (cluster_name == "characteristic_2")
    data_cluster_name = "소득, 성적연계 장학금";
  else if (cluster_name == "characteristic_money_0")
    data_cluster_name = "등록금 삭감 장학금";
  else if (cluster_name == "characteristic_money_1")
    data_cluster_name = "생활비 지급 장학금";
  else if (cluster_name == "characteristic_money_2")
    data_cluster_name = "등록금, 생활비 지급 장학금";
  else if (cluster_name == "region") data_cluster_name = "지역 장학금";
  $(".r_c").text(data_cluster_name);

  $("#grp").remove();
  var rw = document.getElementById("reco_content1");

  var grp = document.createElement("div");
  grp.setAttribute("class", "group");
  grp.setAttribute("id", "grp");
  rw.appendChild(grp);

  var leftIMG = document.createElement("img");
  leftIMG.setAttribute("src", "./public/img/left.png");
  leftIMG.setAttribute("class", "left");
  grp.appendChild(leftIMG);

  var wrpDIV = document.createElement("div");
  wrpDIV.setAttribute("class", "post-wrapper");
  wrpDIV.setAttribute("id", `pw${cnt}`);
  grp.appendChild(wrpDIV);

  var rightIMG = document.createElement("img");
  rightIMG.setAttribute("src", "./public/img/right.png");
  rightIMG.setAttribute("class", "right");
  grp.appendChild(rightIMG);

  if (Object.keys(dt.cluster_contents).length >= 5) {
    for (var i = 0; i < Object.keys(dt.cluster_contents).length; i++) {
      var sch = dt.cluster_contents[i];
      var date_start = sch.date_start.split(" ")[0].replaceAll("-", ".");
      var date_end = sch.date_end.split(" ")[0].replaceAll("-", ".");
      var price = sch.scholarship_price
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

      var newDIV = document.createElement("div");
      newDIV.setAttribute("class", "scholarship");
      newDIV.setAttribute("onclick", "scholarship(" + cnt + "," + i + ")");
      newDIV.style.width = "191px";
      var pw = document.getElementById(`pw${cnt}`);
      pw.appendChild(newDIV);

      var nameDIV = document.createElement("div");
      nameDIV.setAttribute("class", "s_name");
      nameDIV.innerHTML = sch.name;
      newDIV.appendChild(nameDIV);

      var periodDIV = document.createElement("div");
      periodDIV.setAttribute("class", "s_period");
      periodDIV.innerHTML = "신청기간";
      newDIV.appendChild(periodDIV);

      var periodInfoDIV = document.createElement("div");
      periodInfoDIV.setAttribute("class", "s_period_info");
      periodInfoDIV.innerHTML = `${date_start}~${date_end}`;
      newDIV.appendChild(periodInfoDIV);

      var moneyDIV = document.createElement("div");
      moneyDIV.setAttribute("class", "s_money");
      moneyDIV.innerHTML = "예상 수령 장학금액";
      newDIV.appendChild(moneyDIV);

      var moneyInfoDIV = document.createElement("div");
      moneyInfoDIV.setAttribute("class", "s_moeny_info");
      if (price == "0") price = "- ";
      moneyInfoDIV.innerHTML = `${price}원`;
      newDIV.appendChild(moneyInfoDIV);
    }

    var groupDIV = document.getElementById(`pw${cnt}`);
    groupDIV.style.display = "flex";

    $(`#pw${cnt}`).slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      nextArrow: $(".right"),
      prevArrow: $(".left"),
    });
  } else {
    leftIMG.style.zIndex = -100;
    rightIMG.style.zIndex = -100;
    for (var i = 0; i < Object.keys(dt.cluster_contents).length; i++) {
      var sch = dt.cluster_contents[i];
      var date_start = sch.date_start.split(" ")[0].replaceAll("-", ".");
      var date_end = sch.date_end.split(" ")[0].replaceAll("-", ".");
      var price = sch.scholarship_price
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

      var newDIV = document.createElement("div");
      newDIV.setAttribute("class", "scholarship");
      newDIV.setAttribute("onclick", "scholarship(" + cnt + "," + i + ")");
      newDIV.style.width = "191px";
      var pw = document.getElementById(`pw${cnt}`);
      pw.appendChild(newDIV);

      var nameDIV = document.createElement("div");
      nameDIV.setAttribute("class", "s_name");
      nameDIV.innerHTML = sch.name;
      newDIV.appendChild(nameDIV);

      var periodDIV = document.createElement("div");
      periodDIV.setAttribute("class", "s_period");
      periodDIV.innerHTML = "신청기간";
      newDIV.appendChild(periodDIV);

      var periodInfoDIV = document.createElement("div");
      periodInfoDIV.setAttribute("class", "s_period_info");
      periodInfoDIV.innerHTML = `${date_start}~${date_end}`;
      newDIV.appendChild(periodInfoDIV);

      var moneyDIV = document.createElement("div");
      moneyDIV.setAttribute("class", "s_money");
      moneyDIV.innerHTML = "예상 수령 장학금액";
      newDIV.appendChild(moneyDIV);

      var moneyInfoDIV = document.createElement("div");
      moneyInfoDIV.setAttribute("class", "s_moeny_info");
      moneyInfoDIV.innerHTML = `${price}원`;
      newDIV.appendChild(moneyInfoDIV);
    }

    var groupDIV = document.getElementById(`pw${cnt}`);
    groupDIV.style.display = "flex";
  }
}
