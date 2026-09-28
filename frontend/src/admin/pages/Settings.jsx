/**
 * Settings.jsx — System configuration panel
 */
import React, { useState } from 'react';
import { Switch, Slider, Button, message, Input, Select, Tag } from 'antd';
import { MdSave, MdSettings, MdEmail, MdBuild, MdPeople } from 'react-icons/md';

const { Option } = Select;

const Settings = () => {
  const [settings, setSettings] = useState({
    matchingThreshold: 65,
    allowRegistration: true,
    emailNotifications: true,
    maintenanceMode: false,
    maxRecommendations: 5,
    profileRequiredFields: true,
    autoApproveStudents: false,
    adminEmail: 'admin@futurepath.ai',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    systemName: 'FuturePath AI',
    language: 'English',
  });

  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    message.success('Settings saved successfully!');
  };

  const GROUP_ICON_STYLE = { fontSize: 18, marginRight: 8 };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Settings</h1><p>Configure system preferences</p></div>
        <Button type="primary" icon={<MdSave />} size="large" style={{ borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleSave}>
          Save Settings
        </Button>
      </div>

      {/* Matching & Recommendations */}
      <div className="settings-group">
        <div className="settings-group-header">
          <MdSettings style={GROUP_ICON_STYLE} />AI Matching Configuration
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Matching Threshold (%)</div>
            <div className="settings-item-desc">Minimum compatibility score to show a career recommendation</div>
          </div>
          <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Slider min={0} max={100} value={settings.matchingThreshold} onChange={v => update('matchingThreshold', v)} style={{ flex: 1 }} />
            <Tag color="blue" style={{ borderRadius: 6, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{settings.matchingThreshold}%</Tag>
          </div>
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Max Recommendations Per Student</div>
            <div className="settings-item-desc">Maximum number of career suggestions to show</div>
          </div>
          <Select value={settings.maxRecommendations} style={{ width: 100 }} onChange={v => update('maxRecommendations', v)}>
            {[3,5,7,10].map(n => <Option key={n} value={n}>{n}</Option>)}
          </Select>
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Require Complete Profile for Recommendations</div>
            <div className="settings-item-desc">Only generate recommendations for students with complete profiles</div>
          </div>
          <Switch checked={settings.profileRequiredFields} onChange={v => update('profileRequiredFields', v)} />
        </div>
      </div>

      {/* Registration */}
      <div className="settings-group">
        <div className="settings-group-header">
          <MdPeople style={GROUP_ICON_STYLE} />Registration & Access
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Allow Student Registration</div>
            <div className="settings-item-desc">Enable or disable new student sign-ups</div>
          </div>
          <Switch checked={settings.allowRegistration} onChange={v => update('allowRegistration', v)} />
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Auto-Approve Students</div>
            <div className="settings-item-desc">Automatically activate accounts without admin review</div>
          </div>
          <Switch checked={settings.autoApproveStudents} onChange={v => update('autoApproveStudents', v)} />
        </div>
      </div>

      {/* Email Notifications */}
      <div className="settings-group">
        <div className="settings-group-header">
          <MdEmail style={GROUP_ICON_STYLE} />Email Notifications
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Enable Email Notifications</div>
            <div className="settings-item-desc">Send system emails to students and admins</div>
          </div>
          <Switch checked={settings.emailNotifications} onChange={v => update('emailNotifications', v)} />
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Admin Email Address</div>
            <div className="settings-item-desc">Primary contact for system alerts</div>
          </div>
          <Input value={settings.adminEmail} style={{ width: 260, borderRadius: 8 }} onChange={e => update('adminEmail', e.target.value)} />
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">SMTP Host</div>
            <div className="settings-item-desc">Email server hostname</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input value={settings.smtpHost} style={{ width: 200, borderRadius: 8 }} onChange={e => update('smtpHost', e.target.value)} />
            <Input value={settings.smtpPort} style={{ width: 80, borderRadius: 8 }} onChange={e => update('smtpPort', e.target.value)} placeholder="Port" />
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className="settings-group">
        <div className="settings-group-header">
          <MdBuild style={GROUP_ICON_STYLE} />System Maintenance
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Maintenance Mode</div>
            <div className="settings-item-desc">⚠️ Put the site in maintenance mode — students cannot log in</div>
          </div>
          <Switch
            checked={settings.maintenanceMode}
            onChange={v => { update('maintenanceMode', v); if (v) message.warning('Maintenance mode enabled! Students cannot access the system.'); }}
            style={{ backgroundColor: settings.maintenanceMode ? '#ef4444' : undefined }}
          />
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">System Name</div>
            <div className="settings-item-desc">Application name shown throughout the UI</div>
          </div>
          <Input value={settings.systemName} style={{ width: 220, borderRadius: 8 }} onChange={e => update('systemName', e.target.value)} />
        </div>
        <div className="settings-item">
          <div>
            <div className="settings-item-label">Language</div>
            <div className="settings-item-desc">Default system language</div>
          </div>
          <Select value={settings.language} style={{ width: 160 }} onChange={v => update('language', v)}>
            {['English','Sinhala','Tamil'].map(l => <Option key={l} value={l}>{l}</Option>)}
          </Select>
        </div>
      </div>

      <div style={{ textAlign: 'right', marginTop: 8 }}>
        <Button type="primary" size="large" icon={<MdSave />} style={{ borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={handleSave}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
