import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, CanvasJSAngularChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  chartOptions = {
    title: {
      text: 'Monthly Sales Data',
    },
    theme: 'light2',
    animationEnabled: true,
    exportEnabled: true,
    axisY: {
      includeZero: true,
      valueFormatString: '$#,##0k',
    },
    data: [
      {
        type: 'column', //change type to bar, line, area, pie, etc
        yValueFormatString: '$#,##0k',
        color: '#3F51B5',
        dataPoints: [
          { label: 'Jan', y: 172 },
          { label: 'Feb', y: 189 },
          { label: 'Mar', y: 201 },
          { label: 'Apr', y: 240 },
          { label: 'May', y: 166 },
          { label: 'Jun', y: 196 },
          { label: 'Jul', y: 218 },
          { label: 'Aug', y: 167 },
          { label: 'Sep', y: 175 },
          { label: 'Oct', y: 152 },
          { label: 'Nov', y: 156 },
          { label: 'Dec', y: 164 },
        ],
      },
    ],
  };

}
