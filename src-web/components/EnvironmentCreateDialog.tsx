import { useState } from 'react';
import { Checkbox } from './core/Checkbox';
import { PlainInput } from './core/PlainInput';

interface Props {
  hide: () => void;
}

export function EnvironmentCreateDialog({ hide }: Props) {
  const [name, setName] = useState<string>();
  const [isPrivate, setPrivate] = useState<boolean>(false);
  return (
    <div>
      <PlainInput label="Name" onChange={setName} defaultValue={name} />
      <Checkbox title="Private" onChange={setPrivate} checked={isPrivate} />
    </div>
  );
}
