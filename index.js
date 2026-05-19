import { DELETE, GET, multipartPOST, UPDATE } from "./api/crud.js";

(() => {

    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("previewImage");

    fileInput.addEventListener("change", (e) => {
        handleFile(e.target.files[0]);
    });

    

    function handleFile(file) {
        if (!file || !file.type.startsWith("image/")) {
            alert("Invalid image file");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            preview.src = reader.result;
        };

        reader.readAsDataURL(file);

        document.querySelector(".dropZonePlaceholder").classList.add("hidden");
    }

    const submit = document.querySelector(".saveProjectButton");

    submit.addEventListener("click", (e) => {
        e.preventDefault();
        saveProject(fileInput.files[0]);
    });

}) ();

async function saveProject (image) {

    const formData = new FormData();

    const data = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        date: document.getElementById("date").value.trim()
    };

    console.log(data);

    // send JSON as a string
    formData.append("project_data", JSON.stringify(data));

    // send single file
    formData.append("images", image);

    const url = "http://localhost:80/jonasSamPortFolio/backend/src/jonasSamindex.php/save-project"

    const result = await multipartPOST(url, formData);

    if(result.status === 201) {
        renderProjects();
    }

}

const projectIds = [];

async function renderProjects() {
    const url = "http://localhost/jonasSamPortFolio/backend/src/jonasSamindex.php/get-projects";
    const result = await GET(url);

    const projects = document.getElementById("projects");

    result.data.forEach(project => {

        if (projectIds.includes(project.id)) {
            return;
        }

        projectIds.push(project.id);

        const box = `
            <div class="project-card" data-box-id="${project.id}">
                <div class="editDeleteProjectContainer">
                    <button class="editProject" data-project-id="${project.id}">Edit</button>
                    <button class="deleteProject" data-project-id="${project.id}">Delete</button>
                </div>
                <img src="http://localhost/jonasSamPortFolio/backend/src${project.imageUrl}">
                <div class="project-card-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-date">${project.date}</div>
                </div>
            </div>
        `;

        projects.insertAdjacentHTML("beforeend", box);

    });
}

(async () => {

    renderProjects();

}) ();

(() => {

    const projects = document.getElementById("projects");
    const sideHustle = document.querySelector(".sideHustleBackground");
    const sideHustleOverlayForClosing = document.querySelector(".sideHustleOverlayForClosing");

    projects.addEventListener("click", async (event) => {
        if (event.target.closest(".editProject")) {

            const projectId = event.target.dataset.projectId;

            document.querySelector(".saveEdit").dataset.projectId = projectId;
            sideHustle.classList.add("show");
            sideHustleOverlayForClosing.classList.add("doYourJob");

            const editTitleEl = document.getElementById("editTitle");
            const editDateEl = document.getElementById("editDate");
            const editdescriptionEl = document.getElementById("editdescription"); 

            const getUrl = `http://localhost:80/jonasSamPortFolio/backend/src/jonasSamindex.php/get-project?id=${projectId}`;
            const result = await GET(getUrl);

            console.log(result);
            editTitleEl.value = result.data.title;
            editDateEl.value = result.data.date;
            editdescriptionEl.value = result.data.description;
        }
    });

    sideHustleOverlayForClosing.addEventListener("click", () => {
        sideHustle.classList.remove("show");
        sideHustleOverlayForClosing.classList.remove("doYourJob");
    });

}) ();

(() => {
    
    const url = "http://localhost:80/jonasSamPortFolio/backend/src/jonasSamindex.php/edit-project";

    const saveEdit = document.querySelector(".saveEdit");
    const fileInputEditVersion = document.querySelector(".fileInputEditVersion");

    saveEdit.addEventListener("click", async (event) => {

        const projectId = event.target.dataset.projectId;

        const editTitleEl = document.getElementById("editTitle");
        const editDateEl = document.getElementById("editDate");
        const editdescriptionEl = document.getElementById("editdescription");

        const projectData = {
            project_id: projectId,
            title: editTitleEl.value.trim(),
            description: editdescriptionEl.value.trim(),
            date: editDateEl.value.trim()
        };

        console.log(projectData);

        const result = await UPDATE(url, projectData);
      console.log(result.status);
        if(result.status === 200) {
            const projectBox = document.querySelector(`[data-box-id="${projectId}"]`);
            const newTitle = projectBox.querySelector("h3");
            const newDate = projectBox.querySelector(".project-date");
            const newDescription = projectBox.querySelector(".project-description");

            newTitle.innerText = projectData.title;
            newDate.innerText = projectData.date;
            newDescription.innerHTML = projectData.description;
        }
        
    });

}) ();

(() => {

    const deleteModal = document.querySelector(".delete-modal");
    const confirmDelete = document.getElementById("confirmDelete");
    
    document.addEventListener("click", (event) => {
        if (event.target.closest(".deleteProject")) {
            confirmDelete.dataset.projectId = event.target.dataset.projectId;

            deleteModal.classList.add("show");
        }
    });

    document.getElementById("cancelDelete").addEventListener("click", () => {
        deleteModal.classList.remove("show");
    });

    document.getElementById("confirmDelete").addEventListener("click", (event) => {
        const projectId = event.target.dataset.projectId;
        deleteProject(projectId);
    });

}) ();

async function deleteProject(project_id) {

    const deleteModal = document.querySelector(".delete-modal");
    
    const url = "http://localhost:80/jonasSamPortFolio/backend/src/jonasSamindex.php/delete-project";
    const body = {
        project_id: project_id
    };

    const result = await DELETE(url, body);

    if(result.status === 200) {
        const box = document.querySelector(`[data-box-id="${project_id}"]`);
        
        box.remove();
    }

    deleteModal.classList.remove("show");

}