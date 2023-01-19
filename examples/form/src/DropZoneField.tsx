import * as React from 'react';
import Dropzone from 'react-dropzone';
import { useFormSetValue } from 'relay-forms-nodeps';

export type DropZoneFieldType = { files: File[] } | undefined;

let key = 1;

export const DropZoneField: React.FC<any> = ({ fieldKey }) => {
    const [{value}, setValue] = useFormSetValue<DropZoneFieldType>({
        key: fieldKey,
        initialValue: undefined,
    });

    const files = value ? (value?.files as any[]).map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      )) : <></>;
    return (
        <div className="form-group">
            <label>Multiple files</label>
            <Dropzone
                onDrop={(files) =>
                    setValue({
                        files,
                    })
                }
            >
                {({ getRootProps, getInputProps }) => (
                    <section className="container">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        Click me to upload a file!
                    </div>
                    <aside>
                        <h4>Files</h4>
                        <ul>{files}</ul>
                    </aside>
                  </section>
                )}
            </Dropzone>
        </div>
    );
};
