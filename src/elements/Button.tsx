type ButtonKind = 'fill' | 'outline';

type ButtonProps<C extends React.ElementType> = {
    component?: C;
    kind?: ButtonKind
    className?: string;
} & React.ComponentPropsWithoutRef<C>;

const classes = {
    "fill": "cursor-pointer px-6 py-3 bg-yellow-400 text-black rounded-lg",
    "outline": "cursor-pointer px-6 py-3 border-1 border-yellow-400 text-yellow-400 rounded-lg"
}

export const Button = <C extends React.ElementType = 'button'>({component, kind, className, ...restProps}: ButtonProps<C>) => {
    const Component = component || 'button';
    const k = kind ? kind : "fill";
    const c = className ? `${classes[k]} ${className}` : classes[k]

    return <Component className={c} {...restProps} />
}
