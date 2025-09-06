export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleFileExtensions: ["ts", "tsx", "js"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    globals: {
        "ts-jest": {
            tsconfig: {
                jsx: "react-jsx",
                types: ["jest", "@testing-library/jest-dom"],
            },
        },
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    collectCoverage: false,
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/vite-env.d.ts", "!src/main.tsx"],
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
};
