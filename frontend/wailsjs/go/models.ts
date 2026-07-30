export namespace model {
	
	export class AddErrorQuestionReq {
	    menuId: number;
	    questionImg: string;
	    answerImg: string;
	    questBase: string;
	    answerBase: string;
	    remark: string;
	    masterLevel: number;
	
	    static createFrom(source: any = {}) {
	        return new AddErrorQuestionReq(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.menuId = source["menuId"];
	        this.questionImg = source["questionImg"];
	        this.answerImg = source["answerImg"];
	        this.questBase = source["questBase"];
	        this.answerBase = source["answerBase"];
	        this.remark = source["remark"];
	        this.masterLevel = source["masterLevel"];
	    }
	}
	export class AddSysMenuDto {
	    MenuKey: string;
	    Label: string;
	    Type: string;
	    ParentID: number;
	
	    static createFrom(source: any = {}) {
	        return new AddSysMenuDto(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.MenuKey = source["MenuKey"];
	        this.Label = source["Label"];
	        this.Type = source["Type"];
	        this.ParentID = source["ParentID"];
	    }
	}
	export class MenuTreeDto {
	    key: string;
	    label: string;
	    type?: string;
	    children?: MenuTreeDto[];
	
	    static createFrom(source: any = {}) {
	        return new MenuTreeDto(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.label = source["label"];
	        this.type = source["type"];
	        this.children = this.convertValues(source["children"], MenuTreeDto);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SelectOption {
	    label: string;
	    value: number;
	
	    static createFrom(source: any = {}) {
	        return new SelectOption(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.label = source["label"];
	        this.value = source["value"];
	    }
	}
	export class SysErrorQuestion {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    MenuID: number;
	    QuestionImg: string;
	    AnswerImg: string;
	    Remark: string;
	    MasterLevel: number;
	    Enabled: number;
	
	    static createFrom(source: any = {}) {
	        return new SysErrorQuestion(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.MenuID = source["MenuID"];
	        this.QuestionImg = source["QuestionImg"];
	        this.AnswerImg = source["AnswerImg"];
	        this.Remark = source["Remark"];
	        this.MasterLevel = source["MasterLevel"];
	        this.Enabled = source["Enabled"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

