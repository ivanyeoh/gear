angular.module('demo', ['gear'])
    .controller('demoCtrl', function ($scope) {
        $scope.data = {};
        $scope.dataDefinitions = [
            {
                field: 'amount',
                type: 'money',
                validations: [
                    {
                        type: 'required',
                        message: 'This field is required'
                    },
                    {
                        type: 'min',
                        value: 1,
                        message: 'The minimum amount is 1'
                    }
                ]
            },
            {
                "field": "transaction_datetime",
                "type": "datetime",
                "validations": [
                    {
                        type: 'required',
                        message: 'This field is required'
                    }
                ]
            }
//            {
//                field: 'transaction_number',
//                type: 'string',
//                display_on: "form",
//                length: 30,
//                validations: [
//                    {
//                        type: 'max_length',
//                        length: 30
//                    }
//                ]
//            },
//            {
//                field: 'transaction_datetime',
//                type: 'datetime',
//                display_on: "form",
//                validations: [
//                    {
//                        type: 'less_than_now',
//                        message: 'This field must be less than now'
//                    }
//                ]
//            }
        ];
    });