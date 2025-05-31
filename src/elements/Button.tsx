type ButtonProps<C extends React.ElementType> = {
    component?: C;
} & React.ComponentPropsWithoutRef<C>;

export const Button = <C extends React.ElementType = 'button'>({component, ...restProps}: ButtonProps<C>) => {
    const Component = component || 'button';

    return <Component className="px-6 py-3 bg-yellow-400 text-black rounded-lg" {...restProps} />
}
