import { useEffect } from 'react';
import {
    Admin,
    CustomRoutes,
    ListGuesser,
    RaThemeOptions,
    Resource,
    defaultTheme,
    localStorageStore,
} from 'react-admin';
import type { AdminProps, AuthProvider, DataProvider } from 'react-admin';
import { deepmerge } from '@mui/utils';
import { Route } from 'react-router';
import { ForgotPasswordPage, SetPasswordPage } from 'ra-supabase';

import { Layout } from '../layout/Layout';
import { i18nProvider } from './i18nProvider';
import companies from '../companies';
import leads from '../leads';
import { Dashboard } from '../dashboard/Dashboard';
import deals from '../deals';
import { LoginPage } from '../login/LoginPage';
import { SignupPage } from '../login/SignupPage';
import {
    authProvider as defaultAuthProvider,
    dataProvider as defaultDataProvider,
} from '../providers/supabase';
import sales from '../sales';
import { SettingsPage } from '../settings/SettingsPage';
import {
    ConfigurationContextValue,
    ConfigurationProvider,
} from './ConfigurationContext';
import {
    defaultCompanySectors,
    defaultContactGender,
    defaultDealCategories,
    defaultDealPipelineStatuses,
    defaultDealStages,
    defaultLogo,
    defaultNoteStatuses,
    defaultTaskTypes,
    defaultTitle,
} from './defaultConfiguration';

export type CRMProps = {
    dataProvider?: DataProvider;
    authProvider?: AuthProvider;
    lightTheme?: RaThemeOptions;
    darkTheme?: RaThemeOptions;
} & Partial<ConfigurationContextValue> &
    Partial<AdminProps>;

const defaultLightTheme = deepmerge(defaultTheme, {
    palette: {
        background: {
            default: '#fafafb',
        },
        primary: {
            main: '#2F68AC',
        },
    },
    components: {
        RaFileInput: {
            styleOverrides: {
                root: {
                    '& .RaFileInput-dropZone': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
    },
});

export const CRM = ({
    contactGender = defaultContactGender,
    companySectors = defaultCompanySectors,
    darkTheme,
    dealCategories = defaultDealCategories,
    dealPipelineStatuses = defaultDealPipelineStatuses,
    dealStages = defaultDealStages,
    lightTheme = defaultLightTheme,
    logo = defaultLogo,
    noteStatuses = defaultNoteStatuses,
    taskTypes = defaultTaskTypes,
    title = defaultTitle,
    dataProvider = defaultDataProvider,
    authProvider = defaultAuthProvider,
    disableTelemetry,
    ...rest
}: CRMProps) => {
    useEffect(() => {
        if (
            disableTelemetry ||
            process.env.NODE_ENV !== 'production' ||
            typeof window === 'undefined' ||
            typeof window.location === 'undefined' ||
            typeof Image === 'undefined'
        ) {
            return;
        }
        const img = new Image();
        img.src = `https://atomic-crm-telemetry.marmelab.com/atomic-crm-telemetry?domain=${window.location.hostname}`;
    }, [disableTelemetry]);

    return (
        <ConfigurationProvider
            contactGender={contactGender}
            companySectors={companySectors}
            dealCategories={dealCategories}
            dealPipelineStatuses={dealPipelineStatuses}
            dealStages={dealStages}
            logo={logo}
            noteStatuses={noteStatuses}
            taskTypes={taskTypes}
            title={title}
        >
            <Admin
                dataProvider={dataProvider}
                authProvider={authProvider}
                store={localStorageStore(undefined, 'CRM')}
                layout={Layout}
                loginPage={LoginPage}
                dashboard={Dashboard}
                theme={lightTheme}
                darkTheme={darkTheme || null}
                i18nProvider={i18nProvider}
                requireAuth
                disableTelemetry
                {...rest}
            >
                <CustomRoutes noLayout>
                    <Route path={SignupPage.path} element={<SignupPage />} />
                    <Route
                        path={SetPasswordPage.path}
                        element={<SetPasswordPage />}
                    />
                    <Route
                        path={ForgotPasswordPage.path}
                        element={<ForgotPasswordPage />}
                    />
                </CustomRoutes>

                <CustomRoutes>
                    <Route
                        path={SettingsPage.path}
                        element={<SettingsPage />}
                    />
                </CustomRoutes>
                <Resource name="deals" {...deals} />
                <Resource name="leads" {...leads} />
                <Resource name="companies" {...companies} />
                <Resource name="leadNotes" />
                <Resource name="dealNotes" />
                <Resource name="tasks" list={ListGuesser} />
                <Resource name="sales" {...sales} />
                <Resource name="tags" list={ListGuesser} />
            </Admin>
        </ConfigurationProvider>
    );
};