import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-search-client-dialog',
  templateUrl: './search-client-dialog.component.html',
  styleUrls: ['./search-client-dialog.component.scss']
})
export class SearchClientDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SearchClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
export interface DialogData {
  animal: string;
  name: string;
}
