import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DatabaseService } from '../services/database.service';
import { collection, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { SetTabIndexService } from '../services/set-tab-index.service';
import { SetHeaderService } from '../services/set-header.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ViewChild} from '@angular/core';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, CommonModule, RouterLink,
    FormsModule, MatInputModule, MatFormFieldModule, MatSort, MatSortModule, TranslateModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})

export class TasksComponent {
  allTasks:any = [];
  userData:any;
  loading: boolean = false;
  color: any;
  translate = inject(TranslationService);
  darkmode = inject(ThemeService)
  dataSource = new MatTableDataSource(this.allTasks);
  displayedColumns: string[] = [ 'due', 'status', 'note', 'customerName',];

  constructor(
    public db: Firestore, 
    public dialog: MatDialog, 
    public database: DatabaseService, 
    public tabIndex: SetTabIndexService, 
    public setHeader: SetHeaderService, 
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  async ngOnInit(): Promise<void>{
    await this.getAllTasks('tasks');
    await this.sortTasks();
    this.dataSource.data = this.allTasks; 
    this.checkScreenSize();
  }

  async sortTasks(){
    this.allTasks.sort((a: { status: string; }, b: { status: any; }) => b.status.localeCompare(a.status))
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
  openDialogAddTask(){
    this.dialog.open(DialogAddTaskComponent);
  }

  async getAllTasks(tasks: string) {
    this.loading = true;
    try {
      const tasksCollectionRef = collection(this.db, tasks);
      this.getTaskDataOnSnapshot(tasksCollectionRef);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  }

  getTaskDataOnSnapshot(tasksCollectionRef: any){
    onSnapshot(
      tasksCollectionRef,
      (snapshot: { docs: any[] }) => {
        this.allTasks = [];
        this.allTasks = snapshot.docs.map( (doc) => {
          const taskData = doc.data();
          return {
            taskId: doc.id,
            status: taskData['status'],
            translatedStatus: taskData['translatedStatus'],
            note: taskData['note'],
            customerId: taskData['customerId'],
            customerName: taskData['customerName'],
            due: taskData['due'],
            dueDateStamp: taskData['dueDateStamp'],
            exceeded: taskData['exceeded'],
          };
          
        });
        this.sortTasks()
        this.checkTaskDueDate()
        this.dataSource.data = this.allTasks;
        this.loading = false;
      },
      (error) => {
        console.error('Fehler beim laden der User Daten:', error);
        this.loading = false;
      }
    );
  };
  
  checkTaskDueDate(){
    const today = new Date().getTime();
    this.allTasks.forEach((task: {
      exceeded: boolean; dueDateStamp: number;
      }) => {
      if(task.dueDateStamp <= today){
        task.exceeded = true;
      }else{
        task.exceeded = false;
        if(this.darkmode.darkMode){
          this.color = {'color':'white'}
        }else{
          this.color = {'color':'black'}
        }
      }
    });
  }

  async setTabIndex(index: any){
    await this.tabIndex.setTabToIndex(index);
  }

  async setNewHeader(newHeader:string){
    await this.setHeader.updateHeader(newHeader);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize()
  }

  checkScreenSize(){
    if(typeof window !== undefined){
      const width = window.innerWidth;
      if(width > 1280){
        this.displayedColumns = ['status', 'note', 'customerName', 'due'];
      }
      if(width <= 860){
        this.displayedColumns = ['status', 'customerName', 'due'];
      }
    }
  };
}