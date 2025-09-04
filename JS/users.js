document.addEventListener("DOMContentLoaded", async () => {
    const users = await fetchUsers(); // from api.js

    const table = $('#usersTable').DataTable({
        data: users,
        columns: [
            { data: 'name' },
            { data: 'username' },
            { data: 'email' },
            { data: 'address.city' },
            { data: 'company.name' },
            {
                data: null,
                orderable: false,
                render: (data, type, row) => {
                    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                    const isFav = favorites.includes(row.id);
                    return `
            <button class="btn btn-view " data-id="${row.id}">View</button>
            <button class="btn btn-edit" data-id="${row.id}">Edit</button>
            <button class="btn btn-delete" data-id="${row.id}">Delete</button>
            <button class="btn btn-fav" data-id="${row.id}">
        ${isFav ? "⭐" : "☆"}
      </button>
          `;
                }
            }
        ]
    });

    notify("success", "Users loaded into table!");

    // Actions
    $('#usersTable').on('click', '.btn-view', function () {
        const userId = $(this).data('id');
        const user = users.find(u => u.id === userId);
        alert(`User: ${user.name}\nEmail: ${user.email}\nCity: ${user.address.city}`);
    });

    let currentUserId = null;

    $('#usersTable').on('click', '.btn-edit', function () {
        const userId = $(this).data('id');
        const user = users.find(u => u.id === userId);
        currentUserId = userId;

        // Fill modal form
        document.getElementById('editName').value = user.name;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editCity').value = user.address.city;
        document.getElementById('editCompany').value = user.company.name;

        // Show modal
        document.getElementById('editModal').style.display = "block";
    });

    // Close modal
    document.querySelector('#editModal .close').onclick = () => {
        document.getElementById('editModal').style.display = "none";
    };

    // Save changes
    document.getElementById('editForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const user = users.find(u => u.id === currentUserId);

        user.name = document.getElementById('editName').value;
        user.username = document.getElementById('editUsername').value;
        user.email = document.getElementById('editEmail').value;
        user.address.city = document.getElementById('editCity').value;
        user.company.name = document.getElementById('editCompany').value;

        // Update DataTable row
        const row = $('#usersTable').find(`.btn-edit[data-id='${currentUserId}']`).parents('tr');
        $('#usersTable').DataTable().row(row).data(user).draw();

        // Close modal + notify
        document.getElementById('editModal').style.display = "none";
        notify("success", "User updated!");
    });


    $('#usersTable').on('click', '.btn-delete', function () {
        table.row($(this).parents('tr')).remove().draw();
        notify("warning", "User deleted!");
    });
});


$('#usersTable').on('click', '.btn-fav', function () {
    const userId = $(this).data('id');
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(userId)) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== userId);
        notify("info", "Removed from favorites");
    } else {
        // Add to favorites
        favorites.push(userId);
        notify("success", "Added to favorites");
    }

    // Save updated list
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Re-render row to update star symbol
    $('#usersTable').DataTable().row($(this).parents('tr')).invalidate().draw();
});
