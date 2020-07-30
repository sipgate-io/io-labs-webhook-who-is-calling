const socket = io("/");

const currentCallerContainer = document.querySelector(
  "#current-caller-container"
);
const historyContainer = document.querySelector("#history-container");

const updateHistory = (caller) => {
  const callerRow = document.createElement("tr");
  callerRow.innerHTML = `
		<td>${new Date().toLocaleTimeString()}</td>
        <td>${caller.phonenumber}</td>
		<td>${caller.name}</td>
        <td>${caller.company || "–"}</td>
    `;
  historyContainer.prepend(callerRow);
};

const updateCurrentCaller = (caller) => {
  currentCallerContainer.innerHTML = `
		<p class="name">
			<strong>${caller.name}</strong>
		</p>
		<div class="caller-details">
			<p>${caller.phonenumber}</p>
			<div>
				<p>${caller.company || ""}</p>
				<p>${caller.postal_code || ""} ${caller.city || ""}</p>
				<p>${caller.country || ""}</p>
				<p class="note">${caller.note || ""}</p>
			</div>
		</div>
	`;
};

socket.on("caller", (caller) => {
  caller.name =
    caller.firstname && caller.lastname
      ? `${caller.firstname} ${caller.lastname}`
      : caller.firstname || caller.lastname || "Unknown Caller";

  updateCurrentCaller(caller);
  updateHistory(caller);
});
