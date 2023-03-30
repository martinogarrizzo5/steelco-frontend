const host = "http://localhost:5000";

const dayMilliseconds = 1000 * 60 * 60 * 24;
const dateStyle = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

setInterval(handleReportFetch(), 21600000); // repeat every 6 hours

async function handleReportFetch() {
  try {
    showSpinner();
    const res = await fetch(`${host}/api/report`);
    const reportData = await res.json();

    clearReport();
    reportData.forEach(factory => {
      const factoryEl = buildReportEl(factory);
      document
        .querySelector(`#list`)
        .insertAdjacentHTML(`beforeend`, factoryEl);
    });
    updateTime();
  } catch (err) {
    console.error(err);
  }
}

function buildReportEl(factory) {
  const today = new Date();
  const injuryDate = new Date(factory.lastInjuryDate);
  const timeDifference = today.getTime() - injuryDate.getTime();

  let days = "/";
  if (factory.lastInjuryDate != null) {
    days = Math.ceil(timeDifference / dayMilliseconds);
  }

  let factoryEl = `
    <div class="content__row">
    <h2 class="content__row__stabilimento">${factory.address}(${factory.name}) :
    </h2>
    <span class="count">${days}</span>
    <i class="fa-regular ${
      days < 2 ? "fa-circle-xmark icon--XMark" : "fa-circle-check icon--Check"
    } 
    icon"></i>
    </div>
  `;

  return factoryEl;
}

function clearReport() {
  document.querySelector(`#list`).innerText = "";
}

function showSpinner() {
  const spinner = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
  document.querySelector(`#list`).innerHTML = spinner;
}

function updateTime() {
  document.querySelector(`#update`).innerText =
    "Dati aggiornati a : " + new Date().toLocaleDateString("IT-IT", dateStyle);
}
