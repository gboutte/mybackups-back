import { Injectable, signal, WritableSignal } from '@angular/core';
import { BackupType } from '../models/type/backup-type.model';

@Injectable({
  providedIn: 'root',
})
export class BackupsStore {
  types: WritableSignal<BackupType[]> = signal([]);
}
