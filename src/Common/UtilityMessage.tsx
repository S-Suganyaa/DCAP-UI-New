
// Define PageName as a const object for better type inference
export const PageName = {
    //Admin - Admin Settings
    CreateCriteria: 'CreateCriteria',
    EditCriteria: 'EditCriteria',
    DeleteCriteria: 'DeleteCriteria',
   
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
        case PageName.CreateCriteria:
            return 'Create Criteria';
        case PageName.EditCriteria:
            return 'Edit Criteria';
       
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

        default:
            return "";
    }
}

