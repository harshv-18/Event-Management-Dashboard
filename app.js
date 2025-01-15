function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';

  if (pageId === 'attendees' || pageId === 'tasks') {
    populateEventOptions();
  }
}

async function fetchEvents() {
  const response = await fetch('http://localhost:5000/events');
  const events = await response.json();
  const eventList = document.getElementById('eventList');
  eventList.innerHTML = '';
  events.forEach(event => {
    const li = document.createElement('li');
    li.textContent = `${event.name} - ${event.description} - ${event.location} - ${event.date}`;
    li.appendChild(createDeleteButton(event.id, 'events', fetchEvents));
    eventList.appendChild(li);
  });
}

function createDeleteButton(id, type, fetchFunction) {
  const button = document.createElement('button');
  button.textContent = 'Delete';
  button.onclick = async () => {
    await fetch(`http://localhost:5000/${type}/${id}`, {
      method: 'DELETE'
    });
    fetchFunction();
  };
  return button;
}

async function addEvent(e) {
  e.preventDefault();
  const eventName = document.getElementById('eventName').value;
  const eventDesc = document.getElementById('eventDesc').value;
  const eventLocation = document.getElementById('eventLocation').value;
  const eventDate = document.getElementById('eventDate').value;
  await fetch('http://localhost:5000/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: eventName,
      description: eventDesc,
      location: eventLocation,
      date: eventDate
    })
  });
  document.getElementById('eventName').value = '';
  document.getElementById('eventDesc').value = '';
  document.getElementById('eventLocation').value = '';
  document.getElementById('eventDate').value = '';
  fetchEvents();
}

async function fetchAttendees() {
  const response = await fetch('http://localhost:5000/attendees');
  const attendees = await response.json();
  const attendeeList = document.getElementById('attendeeList');
  attendeeList.innerHTML = '';
  attendees.forEach(attendee => {
    const li = document.createElement('li');
    li.textContent = `${attendee.name} - ${attendee.email} - Event ID: ${attendee.event_id}`;
    li.appendChild(createDeleteButton(attendee.id, 'attendees', fetchAttendees));
    attendeeList.appendChild(li);
  });
}

async function addAttendee(e) {
  e.preventDefault();
  const attendeeName = document.getElementById('attendeeName').value;
  const attendeeEmail = document.getElementById('attendeeEmail').value;
  const attendeeEvent = document.getElementById('attendeeEvent').value;
  await fetch('http://localhost:5000/attendees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: attendeeName,
      email: attendeeEmail,
      event_id: attendeeEvent
    })
  });
  document.getElementById('attendeeName').value = '';
  document.getElementById('attendeeEmail').value = '';
  document.getElementById('attendeeEvent').value = '';
  fetchAttendees();
}

async function fetchTasks() {
  const response = await fetch('http://localhost:5000/tasks');
  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.description} - Event ID: ${task.event_id} - Status: ${task.status}`;
    li.appendChild(createDeleteButton(task.id, 'tasks', fetchTasks));
    taskList.appendChild(li);
  });
}

async function addTask(e) {
  e.preventDefault();
  const taskDesc = document.getElementById('taskDesc').value;
  const taskEvent = document.getElementById('taskEvent').value;
  const taskStatus = document.getElementById('taskStatus').value;
  await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: taskDesc,
      event_id: taskEvent,
      status: taskStatus
    })
  });
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskEvent').value = '';
  document.getElementById('taskStatus').value = 'Pending';
  fetchTasks();
}

async function populateEventOptions() {
  const response = await fetch('http://localhost:5000/events');
  const events = await response.json();
  const attendeeEventSelect = document.getElementById('attendeeEvent');
  const taskEventSelect = document.getElementById('taskEvent');
  attendeeEventSelect.innerHTML = '<option value="">Select Event</option>';
  taskEventSelect.innerHTML = '<option value="">Select Event</option>';
  events.forEach(event => {
    const option = document.createElement('option');
    option.value = event.id;
    option.textContent = event.name;
    attendeeEventSelect.appendChild(option);
    taskEventSelect.appendChild(option);
  });
}

fetchEvents();
fetchAttendees();
fetchTasks();
