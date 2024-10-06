import {NgModule } from '@angular/core';
import {FlexLayoutModule } from "@angular/flex-layout";
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
    imports: [FlexLayoutModule, MatCardModule, MatFormFieldModule, MatSelectModule, 
        MatInputModule, MatButtonModule, MatListModule, MatIconModule, MatRippleModule],
    exports: [FlexLayoutModule, MatCardModule, MatFormFieldModule, MatSelectModule, 
        MatInputModule, MatButtonModule, MatListModule, MatIconModule, MatRippleModule],
    providers: [],
})
export class SharedModule { }
