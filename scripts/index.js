const HOST = "http://localhost:5000";
const FETCH_INTERVAL = 1000 * 60 * 60 * 6; // 6 hours

const warningSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
const dayMilliseconds = 1000 * 60 * 60 * 24;
const dateStyle = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

handleReportFetch().then(() => {
  setInterval(handleReportFetch, FETCH_INTERVAL); // repeat every 6 hours
});

async function handleReportFetch() {
  try {
    showSpinner();
    const res = await fetch(`${HOST}/api/report`);
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
    days = Math.floor(timeDifference / dayMilliseconds);
  }

  let iconToShow = `<div class="icon"></div>`;

  if (days == 0) {
    iconToShow = ` <i class="fa-regular fa-circle-xmark icon--Warning icon"></i>`;
  } else if (days > 80) {
    iconToShow = ` <i class="fa-regular fa-circle-check icon--Check icon"></i>`;
  }

  let factoryEl = `
    <div class="grid__row">
    <h2 class="grid__row__factoryName">${factory.address} (${factory.name}) :
    </h2>
    <span class="count">${days}</span>
    ${iconToShow}
    </div>
  `;

  return factoryEl;
}

function clearReport() {
  document.querySelector(`#list`).innerText = "";
}

function showSpinner() {
  const spinner = `<div class="lds-ring spinner"><div></div><div></div><div></div><div></div></div>`;
  document.querySelector(`#list`).innerHTML = spinner;
}

function updateTime() {
  document.querySelector(`#update`).innerText =
    "Dati aggiornati a : " + new Date().toLocaleDateString("It-IT", dateStyle);
}
