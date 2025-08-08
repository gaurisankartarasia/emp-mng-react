import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  getEmployeeSalaryStructure,
  updateEmployeeSalaryStructure,
} from "@/services/salary-service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const SalaryStructureForm = ({ employeeId, masterComponents }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedTotals, setCalculatedTotals] = useState({
    totalEarnings: 0,
    totalDeductions: 0,
    netSalary: 0,
    calculatedValues: new Map(),
  });

  const { register, control, handleSubmit, watch, reset } = useForm({
    defaultValues: { structure: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "structure",
  });
  const structureValues = watch("structure");

  useEffect(() => {
    const fetchStructure = async () => {
      setIsLoading(true);
      try {
        const existingStructure = await getEmployeeSalaryStructure(employeeId);
        const formatted = existingStructure.map((rule) => ({
          ...rule,
          dependencies:
            typeof rule.dependencies === "string"
              ? JSON.parse(rule.dependencies)
              : rule.dependencies || [],
        }));
        if (formatted.length > 0) {
          reset({ structure: formatted });
        }
      } catch (error) {
        toast.error("Failed to load existing salary structure.", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStructure();
  }, [employeeId, reset]);

  useEffect(() => {
    const calculate = () => {
      const newCalculatedValues = new Map();
      let totalEarnings = 0,
        totalDeductions = 0;
      const structure = structureValues || [];
      const isCalculated = new Set();
      let passes = 0;

      while (
        isCalculated.size < structure.length &&
        passes < structure.length + 1
      ) {
        structure.forEach((rule, index) => {
          if (isCalculated.has(index)) return;

          const componentId = parseInt(rule.component_id);
          if (!componentId) return;

          if (rule.calculation_type === "Flat") {
            newCalculatedValues.set(componentId, parseFloat(rule.value || 0));
            isCalculated.add(index);
          } else if (rule.calculation_type === "Percentage") {
            const dependencyIds = rule.dependencies || [];
            const areDepsMet = dependencyIds.every((depId) =>
              newCalculatedValues.has(depId)
            );

            if (areDepsMet) {
              const baseSum = dependencyIds.reduce(
                (sum, depId) => sum + (newCalculatedValues.get(depId) || 0),
                0
              );
              const calculatedAmount =
                (baseSum * parseFloat(rule.value || 0)) / 100;
              newCalculatedValues.set(componentId, calculatedAmount);
              isCalculated.add(index);
            }
          }
        });
        passes++;
      }

      structure.forEach((rule) => {
        const componentId = parseInt(rule.component_id);
        const component = masterComponents.find((c) => c.id === componentId);
        const amount = newCalculatedValues.get(componentId) || 0;
        if (component?.type === "Earning") totalEarnings += amount;
        else if (component?.type === "Deduction") totalDeductions += amount;
      });

      setCalculatedTotals({
        totalEarnings,
        totalDeductions,
        netSalary: totalEarnings - totalDeductions,
        calculatedValues: newCalculatedValues,
      });
    };
    calculate();
  }, [structureValues, masterComponents]);

  const onSubmit = async (data) => {
    try {
      await updateEmployeeSalaryStructure(employeeId, data.structure);
      toast.success("Salary structure saved successfully.");
    } catch (error) {
      toast.error("Failed to save structure.", { description: error.message });
    }
  };

  const addComponent = () =>
    append({
      component_id: "",
      calculation_type: "Flat",
      value: 0,
      dependencies: [],
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Define Salary Structure</CardTitle>
          <CardDescription>
            Add and configure salary components. Totals are calculated in
            real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Component</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Percentage Of</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const selectedComponentId =
                  structureValues[index]?.component_id;
                const calculationType =
                  structureValues[index]?.calculation_type;
                const currentDependencies =
                  structureValues[index]?.dependencies || [];

                const availableBaseComponents = (structureValues || [])
                  .map((rule) =>
                    masterComponents.find(
                      (mc) => String(mc.id) === String(rule.component_id)
                    )
                  )
                  .filter(
                    (comp) =>
                      comp &&
                      comp.type === "Earning" &&
                      String(comp.id) !== String(selectedComponentId)
                  );

                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Controller
                        name={`structure.${index}.component_id`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={String(field.value || "")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {masterComponents.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.name} ({c.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`structure.${index}.calculation_type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Flat">Flat</SelectItem>
                              <SelectItem value="Percentage">
                                Percentage
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`structure.${index}.value`)}
                      />
                    </TableCell>
                    <TableCell>
                      {calculationType === "Percentage" && (
                        <Controller
                          name={`structure.${index}.dependencies`}
                          control={control}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between"
                                >
                                  {currentDependencies.length > 0
                                    ? `${currentDependencies.length} selected`
                                    : "Select base..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <div className="p-2 space-y-1">
                                  {availableBaseComponents.map((c) => (
                                    <div
                                      key={c.id}
                                      className="flex items-center space-x-2 p-1 rounded hover:bg-accent"
                                    >
                                      <Checkbox
                                        id={`dep-${index}-${c.id}`}
                                        checked={field.value?.includes(c.id)}
                                        onCheckedChange={(checked) => {
                                          const newValue = checked
                                            ? [...(field.value || []), c.id]
                                            : (field.value || []).filter(
                                                (id) => id !== c.id
                                              );
                                          field.onChange(newValue);
                                        }}
                                      />
                                      <label
                                        htmlFor={`dep-${index}-${c.id}`}
                                        className="text-sm font-medium"
                                      >
                                        {c.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {(
                        calculatedTotals.calculatedValues.get(
                          parseInt(selectedComponentId)
                        ) || 0
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button
            type="button"
            variant="outline"
            onClick={addComponent}
            className="mt-4"
          >
            Add Component
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Real-Time Salary Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total Earnings</TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  {calculatedTotals.totalEarnings.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Deductions</TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  {calculatedTotals.totalDeductions.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow className="text-lg">
                <TableCell className="font-semibold">
                  Net Salary (Take-Home)
                </TableCell>
                <TableCell className="text-right font-bold">
                  {calculatedTotals.netSalary.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button type="submit">Save Salary Structure</Button>
      </div>
    </form>
  );
};

export default SalaryStructureForm;
