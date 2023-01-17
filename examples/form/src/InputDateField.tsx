import * as React from 'react';
import { useFormSetValue } from 'relay-hooks/lib/forms';

export type InputDateFieldType = Date | undefined;

export const InputDateField: React.FC<any> = ({ fieldKey }) => {
    const [{value}, setValue] = useFormSetValue<InputDateFieldType>({
        key: fieldKey,
        initialValue: new Date(),
    });

    return (
        <div className="form-group">
            <label>Input Date</label>
            <input
                type="date"
                value={value ? value.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                    //if (file) reader.readAsDataURL(file);
                    setValue(e.target.valueAsDate ? e.target.valueAsDate : undefined);
                }}
            />
            ;
        </div>
    );
};
