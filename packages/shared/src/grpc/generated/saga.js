"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagaServiceService = exports.SAGA_SERVICE_NAME = exports.SagaStatusResponse = exports.SagaIdRequest = exports.SAGA_PACKAGE_NAME = exports.protobufPackage = void 0;
exports.SagaServiceControllerMethods = SagaServiceControllerMethods;
const wire_1 = require("@bufbuild/protobuf/wire");
const microservices_1 = require("@nestjs/microservices");
exports.protobufPackage = "saga";
exports.SAGA_PACKAGE_NAME = "saga";
function createBaseSagaIdRequest() {
    return { orderId: "" };
}
exports.SagaIdRequest = {
    encode(message, writer = new wire_1.BinaryWriter()) {
        if (message.orderId !== "") {
            writer.uint32(10).string(message.orderId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof wire_1.BinaryReader ? input : new wire_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSagaIdRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.orderId = reader.string();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },
};
function createBaseSagaStatusResponse() {
    return { status: "", currentStep: "", updatedAt: "" };
}
exports.SagaStatusResponse = {
    encode(message, writer = new wire_1.BinaryWriter()) {
        if (message.status !== "") {
            writer.uint32(10).string(message.status);
        }
        if (message.currentStep !== "") {
            writer.uint32(18).string(message.currentStep);
        }
        if (message.updatedAt !== "") {
            writer.uint32(26).string(message.updatedAt);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof wire_1.BinaryReader ? input : new wire_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSagaStatusResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.status = reader.string();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.currentStep = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }
                    message.updatedAt = reader.string();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },
};
function SagaServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["getSagaStatus"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("SagaService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("SagaService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.SAGA_SERVICE_NAME = "SagaService";
exports.SagaServiceService = {
    getSagaStatus: {
        path: "/saga.SagaService/GetSagaStatus",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.SagaIdRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.SagaIdRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.SagaStatusResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.SagaStatusResponse.decode(value),
    },
};
//# sourceMappingURL=saga.js.map