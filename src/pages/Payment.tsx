
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, DollarSign, ShieldCheck, Star, Zap } from "lucide-react";
import PageLayout from "@/components/PageLayout";

type Plan = {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    id: 1,
    name: "Basic",
    price: 29,
    description: "Perfect for individuals starting their learning journey",
    features: [
      "Access to 10 courses",
      "Certificate of completion",
      "Basic progress tracking",
      "Limited live sessions",
      "Email support"
    ],
    recommended: false
  },
  {
    id: 2,
    name: "Pro",
    price: 79,
    description: "Our most popular plan for serious learners",
    features: [
      "Access to 50+ courses",
      "Priority certificates",
      "Advanced progress analytics",
      "Unlimited live sessions",
      "Priority email & chat support",
      "Downloadable resources",
      "1 free mentor session"
    ],
    recommended: true,
    badge: "Most Popular"
  },
  {
    id: 3,
    name: "Enterprise",
    price: 199,
    description: "Complete learning solution for organizations",
    features: [
      "Access to all courses",
      "Custom certificates",
      "Team progress dashboards",
      "Unlimited live sessions",
      "24/7 priority support",
      "Downloadable resources",
      "5 free mentor sessions",
      "API access for integrations",
      "Custom course creation"
    ],
    recommended: false,
    badge: "Ultimate"
  }
];

const PlanCard = ({ plan, selected, onSelect }: { plan: Plan; selected: boolean; onSelect: () => void }) => (
  <Card className={`
    overflow-hidden bg-black/40 backdrop-blur-lg transition-all duration-300
    ${selected ? 'border-purple-400 shadow-lg shadow-purple-400/20' : 'border-white/10 hover:border-white/30'}
    ${plan.recommended ? 'transform scale-105 shadow-xl' : ''}
    relative
  `}>
    {plan.badge && (
      <div className="absolute top-0 right-0">
        <Badge className="m-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
          {plan.badge}
        </Badge>
      </div>
    )}
    <CardHeader className="pb-2">
      <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
      <div className="flex items-baseline mt-1">
        <span className="text-3xl font-bold text-white">${plan.price}</span>
        <span className="text-sm text-gray-400 ml-2">/month</span>
      </div>
      <p className="text-sm text-gray-300 mt-2">{plan.description}</p>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check size={18} className="text-green-400 mt-0.5 min-w-[18px]" />
            <span className="text-sm text-gray-200">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="border-t border-white/5 pt-4">
      <Button 
        onClick={onSelect}
        className={`w-full ${
          selected 
            ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" 
            : "border border-white/20 hover:bg-white/10"
        }`}
        variant={selected ? "default" : "outline"}
      >
        {selected ? "Selected" : "Select Plan"}
      </Button>
    </CardFooter>
  </Card>
);

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(2);

  return (
    <PageLayout 
      title="Choose Your Plan" 
      subtitle="Invest in your skills with our flexible subscription options"
      backgroundImage="https://images.unsplash.com/photo-1633158829875-e5316a358c6c?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="glass-morphism p-6 rounded-xl mb-8 max-w-xl mx-auto">
        <div className="flex items-center justify-center">
          <CreditCard size={40} className="text-purple-400 mr-4" />
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">Secure Payment</h2>
            <p className="text-gray-300">Choose the plan that works best for you</p>
          </div>
        </div>
      </div>

      {/* Payment Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map(plan => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            selected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
        ))}
      </div>

      {/* Payment Form */}
      <Card className="mt-10 bg-black/40 border border-white/10 backdrop-blur-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <DollarSign className="text-green-400" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Card Holder Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/10 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456" 
                className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/10 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/10 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">CVV</label>
              <input 
                type="text" 
                placeholder="123" 
                className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/10 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <ShieldCheck className="text-green-500 mt-1" />
            <p className="text-sm text-gray-400">
              Your payment information is secure and encrypted. We never store your full credit card details.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/5 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-black/60 rounded-md border border-white/5">
                <Star className="text-yellow-400" size={20} />
              </div>
              <p className="text-sm text-gray-300">30-day money-back guarantee</p>
            </div>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white">
              <DollarSign size={16} className="mr-2" /> Complete Payment
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-gray-400 text-sm max-w-2xl mx-auto">
        By completing this payment, you agree to our Terms of Service and Privacy Policy.
        You can cancel or change your subscription at any time from your account settings.
      </div>
    </PageLayout>
  );
};

export default Payment;
