document.addEventListener("DOMContentLoaded", function () {

    const inventoryBody = document.getElementById("inventoryBody");
    const searchInput = document.getElementById("searchInput");
    const batchSection = document.getElementById("batchSection");
    const batchBody = document.getElementById("batchBody");
    const isOwner = window.currentUserRole === "Owner";
    const addBtn = document.getElementById("addMedicineBtn");

if (addBtn) {
    addBtn.addEventListener("click", () => {
        window.location.href = "/add-medicine";
    });
}
    // ===============================
    // LOAD MEDICINES
    // ===============================
    async function loadMedicines(search = "") {
        try {
            const res = await fetch(`/api/inventory/search?query=${encodeURIComponent(search)}`, {
                credentials: "include",
                cache: "no-store"
            });

            if (!res.ok) throw new Error("API Error");

            const result = await res.json();

            console.log("Search result:", result);

            inventoryBody.innerHTML = "";

            if (!result.data || result.data.length === 0) {
                inventoryBody.innerHTML =
                    `<tr><td colspan="6">No medicines found</td></tr>`;
                return;
            }

            result.data.forEach(med => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${med.name}</td>
                    <td>${med.generic_name || "-"}</td>
                    <td>${med.atc_code || "-"}</td>
                    <td>${med.gst_rate || 0}%</td>
                    <td>${med.total_stock || 0}</td>
                    <td>
                        <button class="view-btn" data-id="${med.medicine_id}">
                            View Batches
                        </button>
                    </td>
                `;

                inventoryBody.appendChild(row);
            });

        } catch (err) {
            console.error("Error loading medicines:", err);
        }
    }

    // ===============================
    // LOAD BATCHES
    // ===============================
    async function loadBatches(medicineId) {
        try {
            const res = await fetch(`/api/medicines/${medicineId}/batches`, {
                credentials: "include"
            });

            if (!res.ok) throw new Error("Batch API Error");

            const result = await res.json();

            batchBody.innerHTML = "";
            batchSection.classList.remove("hidden");

            if (!result.data || result.data.length === 0) {
                batchBody.innerHTML =
                    `<tr><td colspan="5">No batches available</td></tr>`;
                return;
            }

            result.data.forEach(batch => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${batch.batch_number}</td>
                    <td>${batch.expiry_date}</td>
                    <td>${batch.quantity}</td>
                    <td>${batch.mrp}</td>
                    <td>${batch.purchase_price}</td>
                `;

                batchBody.appendChild(row);
            });

        } catch (err) {
            console.error("Error loading batches:", err);
        }
    }

    // ===============================
    // SEARCH EVENT
    // ===============================
    searchInput.addEventListener("keyup", function () {
        loadMedicines(this.value);
    });

    // ===============================
    // CLICK EVENT (VIEW BATCHES)
    // ===============================
    inventoryBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("view-btn")) {
            const id = e.target.dataset.id;
            loadBatches(id);
        }
    });

    // ===============================
    // INITIAL LOAD
    // ===============================
    loadMedicines();
});