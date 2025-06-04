import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from "react";
import DomainViewer, { DomainViewerProps } from '.';

const meta: Meta<typeof DomainViewer> = {
  title: "Composite/DomainViewer",
  component: DomainViewer,
  argTypes: {
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof DomainViewer>;


const Template: Story = {
  render: (args: DomainViewerProps) => {
    return (
      <div>
        <DomainViewer {...args} />
      </div>
    );
  },
};


const props: DomainViewerProps = {
  space: "1",
  domain: "fragment",
  reference: "biI1KDAy",
  apiBaseUrl: "http://localhost:4000/api",
  authorization: { isAuth: true, access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjUzNjAzMjI3ODMzYTgwMDE3NWYxZWEyIiwiZ2l2ZW5fbmFtZSI6IkphbmUiLCJmYW1pbHlfbmFtZSI6IkRvZSIsIm5hbWUiOiJKYW5lIERvZSIsIm5pY2tuYW1lIjoiSmFuZSIsImVtYWlsIjoiamFuZS5kb2VAaW9hay5vcmciLCJ0eXBlIjoib25lYXV0aCIsInBlcm1pc3Npb25zIjp7IkNPTVBBTllfQURNSU4iOlsiMSIsIjIiLCIzIiwiNCIsIjUiLCI2IiwiNyIsIjgiLCI5IiwiMTAiLCIxMSIsIjEyIiwiMTMiLCIxNCIsIjE1IiwiMTYiLCIxNyIsIjE4Il19LCJpYXQiOjE3NDkwMjMzMTUsImV4cCI6MTc0OTAzMDUxNX0.LeRrX9YOBJ-3Uo6iImuhjXcR0QlQ1ng-csroHdkN5P2tagB8GQBnIIEyvhplWrJBYK9p6s2WvDU0R-Zu4tlWsNF7NVAnnKvWui96t36eYOsThy1EJK5REQzq-5mTBhw1dlNg0TjXOcS-EoFc-Sw4A7fCvYmfSPvZw7FAC90om_p-gD4pXf6QMpZJ8NdXU5PSCBFl9vYVxzultLcBL_Tlak4T2a4ht3Z2C1mYJ13gY_ZVjGTnUaEBm8CQULahDsyAdJKfRt6BERxmhKrDJ9je0d-m_IEPUcGAybd8oyTCR27Mw4n1MIvq-dFx9J6KuIEmuT3cZO7QS894RLY3yjvE6DevaMqCbEsmIZc2DsQI7-sGOphkpdozeTin5h7EJTAII3WUxwb_OrEytX51bqUnEM8z-7jKxXBtBYrmnBcLRU3Bi8Z4EZstgOaMSR_49T4KZ0eSnxuzq7Jx037z4dfZWvsEB4xCHGZApKtRLKzjxv7wmaGgPgRcEseWWzxiOv5O1yt5f3NW6f-mpUGZCVygm9opBEtQTWs9sZNPeSQcRWbObrHCmLe51TfRdVbT06e1v3yQoQ4CQDX4K1Zz18lQTYnYjMH1CTcj3KiENhbGsrnRUVGWcSrTG_Ye36KwQ3_97SAMeuvHNgCGelQbSeg69Tcn_hPOR-7io7tYEJJY6rk" }
}

export const Playground = {
  ...Template, args: {
    ...props
  }
};
