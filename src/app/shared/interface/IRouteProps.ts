export interface IRouteProps {
    index?: boolean;
    path?: string;
    element?: React.ReactElement;
    children?: React.ReactElement | React.ReactElement[];
    name?: string;
    isPrivate?: boolean;
}