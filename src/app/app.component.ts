import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DrAssignment';

  user = {
    Name: '',
    Age: '',
    Gender: '',
    Mobile_number: '',
  };

  allUsers: any[] = [];
  editingUserId: string | null = null;

  ngOnInit() {
    this.fetchAllUsers();
  }

  sendData = async (usr: any) => {
    try {
      const res: any = await fetch('http://localhost:8080/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usr),
      });

      if (!res.ok) {
        throw new Error('Failed to send data');
      }
      await this.fetchAllUsers();  // Refresh user list after adding new user
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchAllUsers = async () => {
    try {
      const res: any = await fetch('http://localhost:8080/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const result: any = await res.json();
      this.allUsers = result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  getValues() {
    if (this.editingUserId) {
      this.updateUser(this.editingUserId, this.user);
    } else {
      this.sendData(this.user);
    }
  }

  updateUser = async (userId: string, updatedData: any) => {
    try {
      const res: any = await fetch(`http://localhost:8080/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }
      await this.fetchAllUsers();  // Refresh user list after updating user
      this.resetForm();  // Clear form after updating
    } catch (error) {
      console.error('Error:', error);
    }
  };

  editUser = (user: any) => {
    this.user = { ...user };
    this.editingUserId = user._id;
  };

  resetForm() {
    this.user = {
      Name: '',
      Age: '',
      Gender: '',
      Mobile_number: '',
    };
    this.editingUserId = null;
  }

  deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res: any = await fetch(`http://localhost:8080/users/${userId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete user');
        }
        await this.fetchAllUsers();  // Refresh user list after deletion
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
}
