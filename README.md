A tool uses npm to generate CRUD screens in VTS Kit FE project.

## Prerequisites

This project requires NodeJS (version 16 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
8.19.4
v16.20.2
```

## Usage

### 1. Place `gencode.json` at your root folder([file example](./gencode.json))
```
{   
    "workspace": "qtht-fe",
    "listFeatureGroups": [
        {
            "featureGroup": "auth",
            "featureGroupExistAlready": false,
            "listFeatures": [
                {
                    "name": "Người dùng hệ thống",
                    "feature": "system-user",
                    "apiUri": {
                        "getList": "systemUser",
                        "create": "systemUser",
                        "update": "systemUser",
                        "lock": "systemUser/lockItem",
                        "delete": "systemUser/deleteItem"
                    },
                    "properties": [
                        {
                            "name": "Mã quyền người dùng",
                            "field": "code",
                            "dataType": "string",
                            "inputType": "text"
                        },
                        {
                            "name": "Tên quyền người dùng",
                            "field": "name",
                            "dataType": "string",
                            "inputType": "text"
                        },
                        {
                            "name": "Số tuổi",
                            "field": "age",
                            "dataType": "number",
                            "inputType": "number"
                        },
                        {
                            "name": "Thể loại phim yêu thích",
                            "field": "favouriteFilm",
                            "dataType": "string",
                            "inputType": "select",
                            "inputMapping": [
                                { "value": "CARTOON", "display": "Hoạt hình"},
                                { "value": "COMEDY", "display": "Hài kịch"},
                                { "value": "HORROR", "display": "Kinh dị"},
                                { "value": "ACTION", "display": "Hành động"}
                            ]
                        },
                        {
                            "name": "Trạng thái",
                            "field": "status",
                            "dataType": "string",
                            "inputType": "radio",
                            "inputMapping": [
                                { "value": "ACTIVE", "display": "Hoạt động"},
                                { "value": "INACTIVE", "display": "Không hoạt động"}
                            ]
                        },
                        {
                            "name": "Ăn trái cây",
                            "field": "fruit",
                            "dataType": "boolean",
                            "inputType": "checkbox"
                        },
                        {
                            "name": "Ngày bắt đầu",
                            "field": "startDate",
                            "dataType": "Date",
                            "inputType": "date-picker"
                        }
                    ]
                }
            ]
        }
    ]
}
```

#### Explain
- **workspace** Root folder name which will be used like @workspace reference
- **featureGroup** Feature group is a group of relatated features
- **featureGroupExistAlready** whether to generate new or use existed feature group. `false` = generate new

### 2. Run command gencode
```
npx gen-fe-d2@latest
```

### Output
```
TODO: Output
```