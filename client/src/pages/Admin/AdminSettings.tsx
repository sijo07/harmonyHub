import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminSettings = () => {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">System Settings</h1>

            <div className="grid gap-8 max-w-2xl">
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-semibold text-white">General Configuration</h2>
                    <div className="grid gap-2">
                        <Label htmlFor="siteName" className="text-white">Site Name</Label>
                        <Input id="siteName" defaultValue="Harmony Hub" className="bg-black/20 border-white/10 text-white" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="maintenance" className="text-white">Maintenance Mode</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="border-white/10 text-white">Enable</Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button className="bg-purple-600 hover:bg-purple-500 text-white">Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
