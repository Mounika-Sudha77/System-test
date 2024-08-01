import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../services/email.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  applicationForm: FormGroup;
  userData: any;
  username:any;
  applications: any[] = [
    {
      name: 'John Doe',
      mobile: '+1-202-555-0173',
      email: 'john.doe@example.com',
      gender: 'male',
      amount: '5000',
      selected: false,
    },
    {
      name: 'Jane Smith',
      mobile: '+1-202-555-0198',
      email: 'jane.smith@example.com',
      gender: 'female',
      amount: '3000',
      selected: false,
    },
    {
      name: 'Michael Johnson',
      mobile: '+1-202-555-0123',
      email: 'michael.johnson@example.com',
      gender: 'male',
      amount: '4500',
      selected: false,
    },
    {
      name: 'Emily Davis',
      mobile: '+1-202-555-0456',
      email: 'emily.davis@example.com',
      gender: 'female',
      amount: '6200',
      selected: false,
    },
  ];
user:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private emailService: EmailService
  ) {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      amount: ['', Validators.required],
      profilePicture: [null, Validators.required],
      markSheet: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.username=this.user.username;
    this.userData = this.emailService.getUserData();
    if (this.userData) {
      this.applications.push(this.userData);
    }
  }

  onSubmit() {
    if (this.applicationForm.valid) {
      const newApplication = this.applicationForm.value;
      this.applications.push(newApplication);
      this.applicationForm.reset();
    }
  }

  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.applicationForm.patchValue({
        [field]: file,
      });
    }
  }

  editApplication(
    name: any,
    mobile: any,
    email: any,
    gender: any,
    amount: any
  ) {
    this.router.navigate(['/registration'], {
      queryParams: { name, mobile, email, gender, amount },
    });
    // this.applications.splice(index, 1);
  }

  deleteApplication(index: number) {
    this.applications.splice(index, 1);
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.applications.forEach((app) => (app.selected = checked));
  }

  downloadSelectedAsExcel() {
    const selectedApplications = this.applications.filter(
      (app) => app.selected
    );
    if (selectedApplications.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(selectedApplications);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'applications');
    }
  }

  saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }
  add() {
    this.router.navigate(['/registration']);
  }
  downloadApplication(application: any) {
    const docDefinition = {
      content: [
        { text: 'Application Details', style: 'header' },
        { text: `Name: ${application.name}`, style: 'content' },
        { text: `Mobile: ${application.mobile}`, style: 'content' },
        { text: `Email: ${application.email}`, style: 'content' },
        { text: `Gender: ${application.gender}`, style: 'content' },
        {
          text: `Application Amount: ${application.amount}`,
          style: 'content',
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        content: { fontSize: 14 },
      },
    };
    pdfMake
      .createPdf(docDefinition)
      .download(`${application.name}_application.pdf`);
  }
  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
