import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { NumberPipe } from "../../pipes/number.pipe";

@Component({
    standalone:true,
    selector: 'star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css'],
    imports: [CommonModule,NumberPipe]
})

export class StarComponent implements OnInit {

    @Input() size :number=12
    @Input() rate :number=0
    @Input() startsNumber :number=5
    @Input() starsClass :string=""
    @Input() lableClass :string=""
    @Input() showNumber :boolean=false



    ngOnInit(): void {
    }
    constructor() { };

}  