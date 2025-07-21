import { json, ActionFunction, LoaderFunction } from '@remix-run/node';
import { getSettings, updateSetting } from '~/lib/google-sheets.server';

export const loader: LoaderFunction = async () => {
  try {
    const settings = await getSettings();
    return json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const { id, value, category } = await request.json();
    await updateSetting(id, value, category);
    return json({ success: true });
  } catch (error) {
    console.error('Error updating setting:', error);
    return json({ error: 'Failed to update setting' }, { status: 500 });
  }
};
