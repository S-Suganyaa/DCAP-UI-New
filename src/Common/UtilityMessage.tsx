
// Define PageName as a const object for better type inference
export const PageName = {
    //Admin - Admin Settings
    CreateGrading: 'CreateGrading',
    EditGrading: 'EditGrading',
    DeleteGrading: 'DeleteGrading',
    CreateTank: 'CreateTank',
    EditTank: 'EditTank',
    DeleteTank: 'DeleteTank',

} as const;

// Create a type from the PageName values
export type PageNameType = (typeof PageName)[keyof typeof PageName];

// Button constants
export const Buttons = {
    ok: "Ok",
    cancel: "Cancel",
    save: "Save",
    update: "Update",
    submit: "Submit",
    Continue: "Continue",
} as const;

export type ButtonType = (typeof Buttons)[keyof typeof Buttons];

// Function type definitions
export function GetTitle(pageNames: PageNameType): string | undefined {
    switch (pageNames) {
        //Admin - Admin Settings
        case PageName.CreateGrading:
            return 'Create Grading';
        case PageName.EditGrading:
            return 'Edit Grading';
        case PageName.DeleteGrading:
            return 'Delete Grading';
        case PageName.CreateTank:
            return 'Create Tank';
        case PageName.EditTank:
            return 'Edit Tank';
        case PageName.DeleteTank:
            return 'Delete Tank';
        default:
            return undefined;
    }
}

export function GetConformationMessage(
    pageNames: PageNameType
): string | undefined {
    switch (pageNames) {
        // example cases
        // case "ManageGrading":
        //     return "Are you sure you want to delete this grading?";

        // case "ManageTankTemplate":
        //     return "Are you sure you want to delete this tank template?";

        default:
            return undefined;
    }
}

export function GetPopupMessage(pageName?: string) {
    switch (pageName) {
        case "CreateGrading":
            return "Grading saved successfully";

        case "UpdateGrading":
            return "Grading updated successfully";

        case "DeleteGrading":
            return "Grading deleted successfully";

        case "CreateTank":
            return "Tank saved successfully";

        case "UpdateTank":
            return "Tank updated successfully";

        case "DeleteTank":
            return "Tank deleted successfully";
        case "UpdateTank":
            return "Tank updated successfully";
        default:
            return "";
    }
}

