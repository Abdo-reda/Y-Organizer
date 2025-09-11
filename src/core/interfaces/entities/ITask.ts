export interface ITask {
    title: string;
    description: string;
    activity: string;
    //isSession? //created for a session or this be a type? should we even make a distinction? we will have to improve tasks view to show session tasks... or we seperate them somehow?
    //dueDate //null or date... if match today, then its due today.. if null, then later
    //status enum? //none, completed, partial, failed?
    //deadline? null or date
    //priority? 0-3?
}