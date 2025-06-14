import { Button } from "@/components/ui/button";

const calcRounded = (idx: number, n: number) => {
    if (idx == 0) {
        return "rounded-e-none";
    }
    if (idx == n-1) {
        return "rounded-s-none";
    }
    return "rounded-none"
}

type Props<T> = Omit<React.ComponentProps<"div">, "onSelect"> & {
    options: T[];
    selected: number;
    onSelect: (option: T) => void;
};

export const ButtonGroup = <T extends string>({ options, selected, onSelect, ...rest }: Props<T>) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const option = event.currentTarget.dataset.option as T;
    onSelect(option);
  }

  return (
    <div {...rest}>
      {options.map((option, idx) => <Button key={option} variant={selected == idx ? "default" : "secondary"} onClick={handleClick} data-option={option} className={calcRounded(idx, options.length)}>{option}</Button>)}
    </div>
  )
}
